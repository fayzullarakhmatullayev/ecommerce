import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { OrderService } from '../../services/OrderService';
import {
  Box,
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
  Select,
  ButtonGroup,
  Button,
  Badge,
  Text
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

export const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      navigate('/login');
      return;
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async (page = 1) => {
    try {
      const data = await OrderService.getOrders(page, pageSize);
      setOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      toast({
        title: 'Error fetching orders',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchOrders(currentPage);
    }
  }, [currentPage, user, pageSize]);

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await OrderService.updateOrder(orderId, { status: newStatus });
      toast({
        title: 'Order status updated',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      fetchOrders(currentPage);
    } catch (error) {
      toast({
        title: 'Error updating order',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await OrderService.deleteOrder(orderId);
        toast({
          title: 'Order deleted',
          status: 'success',
          duration: 2000,
          isClosable: true
        });
        fetchOrders(currentPage);
      } catch (error) {
        toast({
          title: 'Error deleting order',
          description: error.message || 'Something went wrong',
          status: 'error',
          duration: 2000,
          isClosable: true
        });
      }
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      PENDING: 'yellow',
      PROCESSING: 'blue',
      SHIPPED: 'purple',
      DELIVERED: 'green',
      CANCELLED: 'red'
    };
    return colors[status] || 'gray';
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
        <Heading size="lg" mb={6} color="gray.800" textAlign="center">
          Orders Management
        </Heading>
        <Box overflowX="auto">
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
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th py={4}>Order ID</Th>
                <Th py={4}>Date</Th>
                <Th py={4}>Customer</Th>
                <Th py={4}>Total</Th>
                <Th py={4}>Status</Th>
                <Th py={4}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr key={order.id} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                  <Td py={4}>
                    <Link to={`/admin/orders/${order.id}`}>
                      <Badge
                        px={3}
                        py={1}
                        borderRadius="full"
                        colorScheme={getStatusBadgeColor(order.status)}
                        fontSize="sm"
                        fontWeight="semibold"
                        cursor="pointer"
                        _hover={{ transform: 'scale(1.05)' }}
                        transition="all 0.2s"
                      >
                        #{order.id}
                      </Badge>
                    </Link>
                  </Td>
                  <Td py={4} color="gray.600">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Td>
                  <Td py={4} fontWeight="medium">
                    {order.user?.name || 'N/A'}
                  </Td>
                  <Td>
                    <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                      ${order.total.toFixed(2)}
                    </Badge>
                  </Td>

                  <Td py={4}>
                    <Select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      size="sm"
                      width="140px"
                      borderRadius="md"
                      bg={`${getStatusBadgeColor(order.status)}.50`}
                      borderColor={`${getStatusBadgeColor(order.status)}.200`}
                      _hover={{
                        borderColor: `${getStatusBadgeColor(order.status)}.300`
                      }}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </Select>
                  </Td>
                  <Td py={4}>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(order.id)}
                        aria-label="Delete order"
                        _hover={{
                          bg: 'red.50',
                          color: 'red.600'
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
