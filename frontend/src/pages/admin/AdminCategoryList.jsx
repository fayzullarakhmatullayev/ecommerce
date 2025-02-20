import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CategoryService } from '../../services/CategoryService';
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
  Text,
  Badge,
  Select,
  ButtonGroup
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';

export const AdminCategoryList = () => {
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    fetchCategories
  } = useCategories();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      navigate('/login');
      return;
    }
    if (user?.isAdmin) {
      fetchCategories({ page: currentPage, limit: pageSize });
    }
  }, [user, authLoading, navigate, currentPage, pageSize]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const { success, error } = await CategoryService.deleteCategory(id);
        if (success) {
          await fetchCategories();
          toast({
            title: 'Category deleted',
            status: 'success',
            duration: 2000,
            isClosable: true
          });
        } else {
          throw new Error(error);
        }
      } catch (error) {
        toast({
          title: 'Error deleting category',
          description: error.message || 'Something went wrong',
          status: 'error',
          duration: 2000,
          isClosable: true
        });
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1);
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
    <Container maxW="container.xl">
      <Box bg="white" p={6} shadow="lg" borderRadius="xl" borderWidth="1px" borderColor="gray.100">
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

        <Flex px={4} py={2} align="center" justify="flex-end">
          <HStack spacing={2}>
            <Text>Items per page:</Text>
            <Select value={pageSize} onChange={handlePageSizeChange} w="100px">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Select>
          </HStack>
        </Flex>

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
                <Tr key={category.id} _hover={{ bg: 'gray.50' }}>
                  <Td fontWeight="medium">{category.name}</Td>
                  <Td>
                    <Badge colorScheme="blue" borderRadius="full" px={2}>
                      {category._count?.products || 0}
                    </Badge>
                  </Td>
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
                        _hover={{ color: 'red.500', bg: 'red.100' }}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Flex px={4} py={4} align="center" justify="center">
          <ButtonGroup spacing={2}>
            <Button
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button size="sm" variant="outline">
              {currentPage} / {totalPages}
            </Button>
            <Button
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages}
            >
              Next
            </Button>
          </ButtonGroup>
        </Flex>
      </Box>
    </Container>
  );
};
