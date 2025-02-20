import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';
import { useAuth, useCategories, useProducts } from '../../context';
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

export const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();
  const { categories } = useCategories();
  const { getProductById } = useProducts();

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    categoryId: '',
    description: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editor, setEditor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);
        if (!product) throw new Error('Product not found');

        // Helper function to safely parse JSON
        const safeJSONParse = (str) => {
          try {
            return JSON.parse(str);
          } catch {
            return {
              blocks: [
                {
                  type: 'paragraph',
                  data: {
                    text: str || ''
                  }
                }
              ]
            };
          }
        };

        const parsedDescription = safeJSONParse(product?.description);

        setFormData({
          title: product.title,
          price: product.price.toString(),
          categoryId: product.category?.id || '',
          description: product.description
        });

        setExistingImages(
          Array.isArray(product.images)
            ? product.images.map((img) => ({
                url: STORAGE_URL + img.url,
                id: img.id
              }))
            : []
        );

        // Initialize Editor.js with existing content after a small delay
        setTimeout(() => {
          const editorInstance = new EditorJS({
            holder: 'editorjs',
            placeholder: 'Enter product description...',
            data: parsedDescription,
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
      } catch (error) {
        toast({
          title: 'Error loading product',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true
        });
        navigate('/admin/products');
      }
    };

    if (user?.isAdmin) {
      fetchProduct();
    }

    return () => {
      if (editor) {
        editor.destroy();
      }
      // Cleanup image previews
      imageFiles.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [user, authLoading, navigate, id, imageFiles]);

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

  const removeNewImage = (index) => {
    setImageFiles((prev) => {
      const removedImage = prev[index];
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
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

    if (existingImages.length === 0 && imageFiles.length === 0) {
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
      // Upload new images
      const uploadedImageUrls = [];
      for (const { file } of imageFiles) {
        try {
          const formData = new FormData();
          formData.append('image', file);
          const response = await axios.post('/upload', formData);
          uploadedImageUrls.push({ url: response.data.url });
        } catch (error) {
          throw new Error(`Failed to upload image ${file.name}: ${error.message}`);
        }
      }

      // Get description content from Editor.js
      const editorData = await editor.save();

      // Update product with both existing and new images
      await axios.put(`/products/${id}`, {
        ...formData,
        price: parseFloat(formData.price),
        images: [
          ...existingImages.map((img) => ({
            url: img.url.replace(STORAGE_URL, '')
          })),
          ...uploadedImageUrls
        ],
        description: JSON.stringify(editorData),
        category: {
          connect: { id: formData.categoryId }
        }
      });

      toast({
        title: 'Product updated successfully',
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
        title: 'Error updating product',
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
    <Container maxW="container.xl">
      <Box as="form" onSubmit={handleSubmit}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Edit Product</Heading>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting} loadingText="Updating">
            Update Product
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
              {existingImages.map((image, index) => (
                <Box key={index} position="relative">
                  <Image
                    src={image.url}
                    alt={`Product ${index + 1}`}
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
                    onClick={() => removeExistingImage(index)}
                  />
                </Box>
              ))}
              {imageFiles.map((image, index) => (
                <Box key={`new-${index}`} position="relative">
                  <Image
                    src={image.preview}
                    alt={`New ${index + 1}`}
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
                    onClick={() => removeNewImage(index)}
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
