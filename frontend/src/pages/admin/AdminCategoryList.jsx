import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { useAuth, useCategories } from '../../context';
import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  useToast,
  Spinner,
  Flex,
  IconButton,
  Text
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';

export const AdminCategoryList = () => {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      navigate('/login');
      return;
    }
  }, [user, authLoading, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`/categories/${id}`);
        toast({
          title: 'Category deleted',
          status: 'success',
          duration: 2000,
          isClosable: true
        });
      } catch (error) {
        toast({
          title: 'Error deleting category',
          description: error.response?.data?.message || 'Something went wrong',
          status: 'error',
          duration: 2000,
          isClosable: true
        });
      }
    }
  };

  if (authLoading || categoriesLoading)
    return (
      <Flex height="80vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );

  if (categoriesError) return <Text color="red.500">{categoriesError}</Text>;

  if (!user?.isAdmin) return null;

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Categories Management</Heading>
        <Button
          as={Link}
          to="/admin/categories/new"
          colorScheme="blue"
          leftIcon={<AddIcon />}
          size="md"
        >
          Add New Category
        </Button>
      </Flex>

      <Box bg="white" shadow="md" borderRadius="lg" overflow="hidden">
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Products Count</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categories.map((category) => (
                <Tr key={category.id}>
                  <Td>{category.name}</Td>
                  <Td>{category._count?.products || 0}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        as={Link}
                        to={`/admin/categories/edit/${category.id}`}
                        icon={<EditIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        size="sm"
                        aria-label="Edit category"
                        _hover={{ color: 'blue.500', bg: 'blue.100' }}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        aria-label="Delete category"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Container>
  );
};
