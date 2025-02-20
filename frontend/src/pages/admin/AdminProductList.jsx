import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts, useAuth } from '../../context';
import { ProductService } from '../../services/ProductService';
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
  Image,
  HStack,
  useToast,
  Spinner,
  Flex,
  IconButton,
  Select,
  ButtonGroup,
  Text
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { STORAGE_URL } from '../../constants';

export const AdminProductList = () => {
  const { products, fetchProducts, pagination } = useProducts();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      navigate('/login');
      return;
    }
    if (user?.isAdmin) {
      fetchProducts({ page: currentPage, limit: pageSize });
    }
  }, [user, authLoading, navigate, currentPage, pageSize]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await ProductService.deleteProduct(id);
        fetchProducts({ page: currentPage, limit: pageSize });
        toast({
          title: 'Product deleted',
          status: 'success',
          duration: 2000,
          isClosable: true
        });
      } catch (error) {
        toast({
          title: 'Error deleting product',
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
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (authLoading)
    return (
      <Flex height="80vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  if (!user?.isAdmin) return null;

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Products Management</Heading>
        <Button
          as={Link}
          to="/admin/products/new"
          colorScheme="blue"
          leftIcon={<AddIcon />}
          size="md"
        >
          Add New Product
        </Button>
      </Flex>

      <Box bg="white" shadow="md" borderRadius="lg" overflow="hidden">
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
                <Th>Image</Th>
                <Th>Title</Th>
                <Th>Price</Th>
                <Th>Category</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr key={product.id}>
                  <Td>
                    <Image
                      src={
                        Array.isArray(product.images)
                          ? STORAGE_URL + product.images[0]?.url
                          : product.image
                      }
                      alt={product.title}
                      boxSize="50px"
                      objectFit="contain"
                      borderRadius="md"
                    />
                  </Td>
                  <Td maxW="300px" isTruncated>
                    {product.title}
                  </Td>
                  <Td>${product.price.toFixed(2)}</Td>
                  <Td>{product.category?.name}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        as={Link}
                        to={`/admin/products/edit/${product.id}`}
                        icon={<EditIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        size="sm"
                        aria-label="Edit product"
                        _hover={{ color: 'blue.500', bg: 'blue.100' }}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        aria-label="Delete product"
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
              {currentPage} / {pagination.totalPages}
            </Button>
            <Button
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </ButtonGroup>
        </Flex>
      </Box>
    </Container>
  );
};
