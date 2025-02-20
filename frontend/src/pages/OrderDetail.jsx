import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heading,
  Text,
  VStack,
  HStack,
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
  Image,
  Grid,
  GridItem,
  Container,
  Skeleton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { OrderService } from '../services/OrderService';
import { STORAGE_URL } from '../constants';

export const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

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

  const handleCancelOrder = async () => {
    try {
      await OrderService.cancelOrder(id);
      await fetchOrder();
      toast({
        title: 'Success',
        description: 'Order cancelled successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to cancel order',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Skeleton height="40px" width="200px" />
          <Grid templateColumns="repeat(12, 1fr)" gap={6}>
            <GridItem colSpan={8}>
              <Skeleton height="400px" borderRadius="lg" />
            </GridItem>
            <GridItem colSpan={4}>
              <VStack spacing={6}>
                <Skeleton height="200px" borderRadius="lg" />
                <Skeleton height="200px" borderRadius="lg" />
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="center">
          <Text fontSize="xl" color="gray.600">
            Order not found
          </Text>
          <Button
            onClick={() => navigate('/orders')}
            leftIcon={<ArrowBackIcon />}
            colorScheme="blue"
          >
            Back to Orders
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size="lg" color="gray.800">
            Order Details #{order.id}
          </Heading>
          <Button
            onClick={() => navigate('/orders')}
            leftIcon={<ArrowBackIcon />}
            variant="outline"
            colorScheme="blue"
            _hover={{ bg: 'blue.50' }}
            transition="all 0.2s"
          >
            Back to Orders
          </Button>
        </HStack>

        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
          <GridItem colSpan={{ base: 12, md: 8 }}>
            <Card
              variant="outline"
              borderRadius="lg"
              boxShadow="sm"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{ boxShadow: 'md' }}
            >
              <CardHeader borderBottom="1px" borderColor="gray.100" bg="gray.50">
                <Heading size="md" color="gray.700">
                  Order Items
                </Heading>
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
                          <HStack spacing={4}>
                            <Image
                              src={STORAGE_URL + item.product.images[0]?.url}
                              alt={item.product.title}
                              boxSize="50px"
                              objectFit="cover"
                              borderRadius="md"
                              fallbackSrc="https://via.placeholder.com/50"
                            />
                            <Text fontWeight="medium" color="gray.700">
                              {item.product.title}
                            </Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Badge colorScheme="green" px={2} py={1} borderRadius="full">
                            ${item.price.toFixed(2)}
                          </Badge>
                        </Td>
                        <Td>{item.quantity}</Td>
                        <Td isNumeric>
                          <Text fontWeight="bold" color="blue.600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <HStack justify="flex-end" spacing={4} padding="16px 0">
                  <Text fontSize="lg" color="gray.600">
                    Total Amount:
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="blue.600">
                    ${order.total.toFixed(2)}
                  </Text>
                </HStack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem colSpan={{ base: 12, md: 4 }}>
            <VStack spacing={6} align="stretch">
              <Card
                variant="outline"
                borderRadius="lg"
                boxShadow="sm"
                borderColor="gray.200"
                transition="all 0.2s"
                _hover={{ boxShadow: 'md' }}
              >
                <CardHeader borderBottom="1px" borderColor="gray.100" bg="gray.50">
                  <Heading size="md" color="gray.700">
                    Order Status
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between" py={2}>
                      <Text color="gray.600">Status:</Text>
                      <Badge
                        colorScheme={statusColors[order.status]}
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        textTransform="capitalize"
                      >
                        {order.status.toLowerCase()}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between" py={2}>
                      <Text color="gray.600">Order Date:</Text>
                      <Text color="gray.800" fontWeight="medium">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                    </HStack>
                    {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <Button
                        colorScheme="red"
                        variant="outline"
                        width="100%"
                        onClick={onOpen}
                        _hover={{ bg: 'red.50' }}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              <Card
                variant="outline"
                borderRadius="lg"
                boxShadow="sm"
                borderColor="gray.200"
                transition="all 0.2s"
                _hover={{ boxShadow: 'md' }}
              >
                <CardHeader borderBottom="1px" borderColor="gray.100" bg="gray.50">
                  <Heading size="md" color="gray.700">
                    Customer Information
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between">
                      <Text color="gray.600">Name:</Text>
                      <Text color="gray.800" fontWeight="medium">
                        {order.user.name}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.600">Email:</Text>
                      <Text color="gray.800" fontWeight="medium">
                        {order.user.email}
                      </Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Order
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No, Keep Order
              </Button>
              <Button colorScheme="red" onClick={handleCancelOrder} ml={3}>
                Yes, Cancel Order
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};
