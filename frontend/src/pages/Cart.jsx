import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  IconButton,
  useToast,
  Container,
  Divider
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon } from '@chakra-ui/icons';
import { useCart } from '../context';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import { STORAGE_URL } from '../constants';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const toast = useToast();

  const handleCheckout = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast({
      title: 'Order Completed!',
      description: 'Thank you for your purchase!',
      status: 'success',
      duration: 3000,
      isClosable: true
    });

    clearCart();
  };

  if (cart.length === 0) {
    return (
      <Container maxW="container.xl" py={10}>
        <Box textAlign="center" py={10} px={6}>
          <Text fontSize="2xl" fontWeight="bold">
            Your cart is empty
          </Text>
          <Text mt={4} color="gray.600">
            Add some products to your cart to see them here
          </Text>
          <Button as={Link} to="/" colorScheme="blue" size="lg" mt={6}>
            Return to Shop
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Text fontSize="3xl" fontWeight="bold" mb={8}>
        Shopping Cart
      </Text>
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
                  src={Array.isArray(item.images) && STORAGE_URL + item.images[0]?.url}
                  alt={item.title}
                  boxSize="120px"
                  objectFit="contain"
                  bg="white"
                  p={2}
                  borderRadius="md"
                />
                <VStack flex={1} align="start" spacing={3}>
                  <Text fontSize="lg" fontWeight="bold" noOfLines={2}>
                    {item.title}
                  </Text>
                  <Text fontSize="lg" color="blue.600" fontWeight="semibold">
                    ${(item.price * item.quantity).toFixed(2)}
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
  );
};

export default Cart;
