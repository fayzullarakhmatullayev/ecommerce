import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Flex
} from '@chakra-ui/react';

export const AdminCategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { categories, fetchCategories } = useCategories();

  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const category = categories.find((cat) => cat.id === parseInt(id));
    if (category) {
      setName(category.name);
    } else {
      toast({
        title: 'Category not found',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
      navigate('/admin/categories');
    }
  }, [id, categories, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: 'Please enter a category name',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(`/categories/${id}`, { name });
      await fetchCategories();
      toast({
        title: 'Category updated successfully',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      navigate('/admin/categories');
    } catch (error) {
      toast({
        title: 'Error updating category',
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
          <Heading size="lg">Edit Category</Heading>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting} loadingText="Updating">
            Update Category
          </Button>
        </Flex>

        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
            />
          </FormControl>
        </VStack>
      </Box>
    </Container>
  );
};
