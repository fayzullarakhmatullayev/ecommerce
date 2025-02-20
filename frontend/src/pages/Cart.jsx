import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  IconButton,
  Container,
  Divider,
  Flex,
  Spinner
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon } from '@chakra-ui/icons';
import { useAuth, useCart } from '../context';
import { CheckoutModal } from '../components/CheckoutModal';
import { Link, useNavigate } from 'react-router-dom';
import { STORAGE_URL } from '../constants';
import { useEffect, useState } from 'react';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, loading: cartLoading } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if ((!user && !loading) || user?.isAdmin) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {cartLoading && (
        <Flex
          height="60vh"
          position="absolute"
          maxW="100%"
          left="50%"
          align="center"
          justify="center"
          transform="translate(-50%, 0)"
        >
          <Spinner size="xl" />
        </Flex>
      )}
      {cart.length === 0 && !cartLoading ? (
        <Container maxW="container.xl" py={10}>
          <Box textAlign="center" py={10} px={6}>
            <Text fontSize="2xl" fontWeight="bold">
              Your cart is now empty
            </Text>
            <Text mt={4} color="gray.600">
              Feel free to continue shopping
            </Text>
            <Button as={Link} to="/" colorScheme="blue" size="lg" mt={6}>
              Return to Shop
            </Button>
          </Box>
        </Container>
      ) : (
        <>
          <Container maxW="container.xl" py={8}>
            {cart.length > 0 && (
              <Text fontSize="3xl" fontWeight="bold" mb={8}>
                Shopping Cart
              </Text>
            )}
            <Box display="flex" gap={8} flexDirection={{ base: 'column', lg: 'row' }}>
              <VStack spacing={6} align="stretch" flex="1">
                {cart.map((item) => (
                  <Box
                    key={item.id}
                    borderWidth="1px"
                    p={6}
                    borderRadius="lg"
                    shadow="sm"
                    _hover={{ shadow: 'md' }}
                    transition="all 0.2s"
                  >
                    <HStack spacing={6}>
                      <Image
                        src={
                          item.product.images && item.product.images.length > 0
                            ? STORAGE_URL + item.product.images[0].url
                            : ''
                        }
                        alt={item.product.title}
                        boxSize="120px"
                        objectFit="contain"
                        bg="white"
                        p={2}
                        borderRadius="md"
                      />
                      <VStack flex={1} align="start" spacing={3}>
                        <Text fontSize="lg" fontWeight="bold" noOfLines={2}>
                          {item.product.title}
                        </Text>
                        <Text fontSize="lg" color="blue.600" fontWeight="semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </Text>
                        <HStack spacing={4}>
                          <IconButton
                            icon={<MinusIcon />}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            size="md"
                            isDisabled={item.quantity <= 1}
                            colorScheme="blue"
                            variant="outline"
                          />
                          <Text fontSize="lg" fontWeight="medium" minW="40px" textAlign="center">
                            {item.quantity}
                          </Text>
                          <IconButton
                            icon={<AddIcon />}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            size="md"
                            colorScheme="blue"
                            variant="outline"
                          />
                        </HStack>
                      </VStack>
                      <IconButton
                        icon={<DeleteIcon />}
                        onClick={() => removeFromCart(item.id)}
                        colorScheme="red"
                        variant="ghost"
                        size="lg"
                      />
                    </HStack>
                  </Box>
                ))}
              </VStack>

              <Box
                w={{ base: 'full', lg: '400px' }}
                position={{ base: 'relative', lg: 'sticky' }}
                top={{ base: 0, lg: '20px' }}
                h="fit-content"
              >
                <Box borderWidth="1px" borderRadius="lg" p={6} bg="white" shadow="md">
                  <Text fontSize="2xl" fontWeight="bold" mb={6}>
                    Order Summary
                  </Text>
                  <Divider mb={6} />
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="lg">Subtotal</Text>
                      <Text fontSize="lg" fontWeight="semibold">
                        ${getCartTotal().toFixed(2)}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="lg">Shipping</Text>
                      <Text fontSize="lg" color="green.500">
                        Free
                      </Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                      <Text fontSize="xl" fontWeight="bold">
                        Total
                      </Text>
                      <Text fontSize="xl" fontWeight="bold" color="blue.600">
                        ${getCartTotal().toFixed(2)}
                      </Text>
                    </HStack>
                    <Button
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      mt={4}
                      onClick={handleCheckout}
                      height="56px"
                      fontSize="lg"
                    >
                      Checkout
                    </Button>
                  </VStack>
                </Box>
              </Box>
            </Box>
          </Container>
          <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        </>
      )}
    </>
  );
};

export default Cart;
