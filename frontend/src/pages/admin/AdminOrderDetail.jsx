import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Select,
  Button,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Image,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { OrderService } from '../../services/OrderService';
import { STORAGE_URL } from '../../constants';

export const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const statusColors = {
    PENDING: 'yellow',
    PROCESSING: 'blue',
    SHIPPED: 'purple',
    DELIVERED: 'green',
    CANCELLED: 'red'
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await OrderService.getOrder(id);
      setOrder(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch order',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);

      await OrderService.updateOrder(id, { status: newStatus });
      await fetchOrder();
      toast({
        title: 'Success',
        description: 'Order status updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update order status',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!order) {
    return <Box>Order not found</Box>;
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Order Details #{order.id}</Heading>
        <Button onClick={() => navigate('/admin/orders')} variant="outline">
          Back to Orders
        </Button>
      </HStack>

      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={8}>
          <Card mb={6}>
            <CardHeader>
              <Heading size="md">Order Items</Heading>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Product</Th>
                    <Th>Price</Th>
                    <Th>Quantity</Th>
                    <Th isNumeric>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {order.items.map((item) => (
                    <Tr key={item.id}>
                      <Td>
                        <HStack>
                          <Image
                            src={STORAGE_URL + item.product.images[0]?.url}
                            alt={item.product.title}
                            boxSize="50px"
                            objectFit="cover"
                            fallbackSrc="https://via.placeholder.com/50"
                          />
                          <Text>{item.product.title}</Text>
                        </HStack>
                      </Td>
                      <Td>${item.price.toFixed(2)}</Td>
                      <Td>{item.quantity}</Td>
                      <Td isNumeric>${(item.price * item.quantity).toFixed(2)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Divider my={4} />
              <HStack justify="flex-end">
                <Text fontWeight="bold">Total Amount:</Text>
                <Text fontSize="lg" fontWeight="bold">
                  ${order.total.toFixed(2)}
                </Text>
              </HStack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem colSpan={4}>
          <VStack spacing={6} align="stretch">
            <Card>
              <CardHeader>
                <Heading size="md">Order Status</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text>Current Status:</Text>
                    <Badge colorScheme={statusColors[order.status]}>{order.status}</Badge>
                  </HStack>
                  <Box>
                    <Text mb={2}>Update Status:</Text>
                    <Select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      isDisabled={updating}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </Select>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading size="md">Customer Information</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Text>Name:</Text>
                    <Text>{order.user.name}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>Email:</Text>
                    <Text>{order.user.email}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>Order Date:</Text>
                    <Text>{new Date(order.createdAt).toLocaleDateString()}</Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
};
