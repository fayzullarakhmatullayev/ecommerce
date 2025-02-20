import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { useAuth, useCategories } from '../../context';
import {
  Box,
  Button,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Select,
  Image,
  SimpleGrid,
  IconButton,
  Flex
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import { STORAGE_URL } from '../../constants';

export const AdminProductCreate = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();
  const { categories } = useCategories();

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    categoryId: '',
    description: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [editor, setEditor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize Editor.js with a small delay to ensure DOM is ready
    setTimeout(() => {
      const editorInstance = new EditorJS({
        holder: 'editorjs',
        placeholder: 'Enter product description...',
        tools: {
          header: {
            class: Header,
            inlineToolbar: ['link']
          },
          list: {
            class: List,
            inlineToolbar: true
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file) {
                  const formData = new FormData();
                  formData.append('image', file);
                  const response = await axios.post('/upload', formData);
                  return {
                    success: 1,
                    file: {
                      url: STORAGE_URL + response.data.url
                    }
                  };
                }
              }
            }
          }
        }
      });

      setEditor(editorInstance);
    }, 100);

    return () => {
      if (editor) {
        editor.destroy();
      }
      // Cleanup image previews
      imageFiles.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [user, authLoading, navigate, imageFiles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImageFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImageFiles((prev) => [...prev, ...newImageFiles]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => {
      const removedImage = prev[index];
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.categoryId) {
      toast({
        title: 'Please fill all required fields',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
      return;
    }

    if (imageFiles.length === 0) {
      toast({
        title: 'Please add at least one image',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload images first
      const uploadedImageUrls = [];
      for (const { file } of imageFiles) {
        try {
          const formData = new FormData();
          formData.append('image', file);
          const response = await axios.post('/upload', formData);
          uploadedImageUrls.push(response.data.url);
        } catch (error) {
          throw new Error(`Failed to upload image ${file.name}: ${error.message}`);
        }
      }

      // Get description content from Editor.js
      const editorData = await editor.save();

      // Create product with uploaded images
      await axios.post('/products', {
        ...formData,
        price: parseFloat(formData.price),
        images: uploadedImageUrls.map((url) => ({ url })),
        description: JSON.stringify(editorData),
        category: {
          connect: { id: formData.categoryId }
        }
      });

      toast({
        title: 'Product created successfully',
        status: 'success',
        duration: 2000,
        isClosable: true
      });

      // Cleanup image previews before navigation
      imageFiles.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });

      navigate('/admin/products');
    } catch (error) {
      toast({
        title: 'Error creating product',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user?.isAdmin) return null;

  return (
    <Container maxW="container.xl" py={8}>
      <Box as="form" onSubmit={handleSubmit}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Create New Product</Heading>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting} loadingText="Creating">
            Create Product
          </Button>
        </Flex>

        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter product title"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Price</FormLabel>
            <Input
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter product price"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              placeholder="Select category"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Images</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              display="none"
              id="image-upload"
            />
            <Button
              as="label"
              htmlFor="image-upload"
              leftIcon={<AddIcon />}
              cursor="pointer"
              mb={4}
            >
              Add Images
            </Button>

            <SimpleGrid columns={[2, 3, 4]} spacing={4}>
              {imageFiles.map((image, index) => (
                <Box key={index} position="relative">
                  <Image
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    boxSize="150px"
                    objectFit="contain"
                    borderRadius="md"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => removeImage(index)}
                  />
                </Box>
              ))}
            </SimpleGrid>
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Box
              id="editorjs"
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              p={4}
              minH="300px"
            />
          </FormControl>
        </VStack>
      </Box>
    </Container>
  );
};
