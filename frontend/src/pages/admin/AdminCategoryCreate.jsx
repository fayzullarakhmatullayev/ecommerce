import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryService } from '../../services/CategoryService';
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

export const AdminCategoryCreate = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { fetchCategories } = useCategories();

  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const { success, error } = await CategoryService.createCategory(name);
      if (success) {
        await fetchCategories();
        toast({
          title: 'Category created successfully',
          status: 'success',
          duration: 2000,
          isClosable: true
        });
        navigate('/admin/categories');
      } else {
        throw new Error(error);
      }
    } catch (error) {
      toast({
        title: 'Error creating category',
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
          <Heading size="lg">Create New Category</Heading>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            loadingText="Creating"
          >
            Create Category
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