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
  Text,
  Badge,
  VStack
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
    setCurrentPage(1);
  };

  if (authLoading)
    return (
      <Flex height="80vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  if (!user?.isAdmin) return null;

  return (
    <Container maxW="container.xl">
      <Box bg="white" p={6} shadow="lg" borderRadius="xl" borderWidth="1px" borderColor="gray.100">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color="gray.800">
            Products Management
          </Heading>
          <Button
            as={Link}
            to="/admin/products/new"
            colorScheme="blue"
            leftIcon={<AddIcon />}
            size="md"
            px={6}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'md'
            }}
            transition="all 0.2s"
          >
            Add New Product
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Flex px={4} py={2} align="center" justify="flex-end" mb={4}>
            <HStack spacing={2}>
              <Text fontWeight="medium">Items per page:</Text>
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                w="100px"
                size="sm"
                borderRadius="md"
                boxShadow="sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </Select>
            </HStack>
          </Flex>

          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th py={4}>Product</Th>
                <Th py={4}>Price</Th>
                <Th py={4}>Category</Th>
                <Th py={4} width="150px">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr key={product.id} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                  <Td py={4}>
                    <HStack spacing={4}>
                      {product.images?.[0] && (
                        <Box
                          width="60px"
                          height="60px"
                          borderRadius="lg"
                          overflow="hidden"
                          boxShadow="sm"
                        >
                          <Image
                            src={STORAGE_URL + product.images[0].url}
                            alt={product.title}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                          />
                        </Box>
                      )}
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold" color="gray.700">
                          {product.title}
                        </Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td py={4}>
                    <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                      ${product.price.toFixed(2)}
                    </Badge>
                  </Td>
                  <Td py={4}>
                    <Badge colorScheme="blue" borderRadius="full" px={3} py={1} fontSize="sm">
                      {product.category.name}
                    </Badge>
                  </Td>
                  <Td py={4}>
                    <HStack spacing={2}>
                      <IconButton
                        as={Link}
                        to={`/admin/products/edit/${product.id}`}
                        icon={<EditIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        size="sm"
                        aria-label="Edit product"
                        _hover={{
                          transform: 'scale(1.1)',
                          bg: 'blue.50'
                        }}
                        transition="all 0.2s"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        aria-label="Delete product"
                        _hover={{
                          transform: 'scale(1.1)',
                          bg: 'red.50'
                        }}
                        transition="all 0.2s"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Flex px={4} py={6} align="center" justify="center">
          <ButtonGroup spacing={2}>
            <Button
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
              colorScheme="blue"
              variant="outline"
              _hover={{
                transform: 'translateX(-2px)'
              }}
              transition="all 0.2s"
            >
              Previous
            </Button>
            <Button size="sm" variant="solid" colorScheme="blue">
              {currentPage} / {pagination.totalPages}
            </Button>
            <Button
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={currentPage === pagination.totalPages}
              colorScheme="blue"
              variant="outline"
              _hover={{
                transform: 'translateX(2px)'
              }}
              transition="all 0.2s"
            >
              Next
            </Button>
          </ButtonGroup>
        </Flex>
      </Box>
    </Container>
  );
};
