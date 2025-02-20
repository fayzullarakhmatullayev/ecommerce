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
import { AddIcon, MinusIcon, DeleteIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useAuth, useCart } from '../context';
import { CheckoutModal } from '../components/CheckoutModal';
import { Link, useNavigate } from 'react-router-dom';
import { STORAGE_URL } from '../constants';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const CartItems = ({ cart, removeFromCart, updateQuantity, navigate }) => {
  CartItems.propTypes = {
    cart: PropTypes.array.isRequired,
    removeFromCart: PropTypes.func.isRequired,
    updateQuantity: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired
  };
  return (
    <VStack spacing={6} align="stretch" flex="1">
      {cart.map((item) => (
        <Box
          key={item.id}
          borderWidth="1px"
          p={6}
          borderRadius="xl"
          shadow="sm"
          bg="white"
          _hover={{ shadow: 'lg' }}
          transition="all 0.3s"
        >
          <HStack spacing={6} align="start">
            <Box
              position="relative"
              width="150px"
              height="150px"
              bg="gray.50"
              borderRadius="lg"
              overflow="hidden"
              p={2}
            >
              <Image
                src={
                  item.product.images && item.product.images.length > 0
                    ? STORAGE_URL + item.product.images[0].url
                    : ''
                }
                alt={item.product.title}
                width="100%"
                height="100%"
                objectFit="contain"
                bg="white"
              />
            </Box>
            <VStack flex={1} align="start" spacing={4}>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="gray.800"
                noOfLines={2}
                _hover={{ color: 'blue.500' }}
                transition="color 0.2s"
                cursor="pointer"
                onClick={() => navigate(`/product/${item.product.id}`)}
              >
                {item.product.title}
              </Text>
              <Text fontSize="2xl" color="blue.600" fontWeight="bold">
                ${(item.product.price * item.quantity).toFixed(2)}
              </Text>
              <HStack spacing={4} align="center">
                <IconButton
                  icon={<MinusIcon />}
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  size="md"
                  isDisabled={item.quantity <= 1}
                  colorScheme="blue"
                  variant="outline"
                  _hover={{
                    transform: 'scale(1.1)',
                    bg: 'blue.50'
                  }}
                  transition="all 0.2s"
                />
                <Text
                  fontSize="lg"
                  fontWeight="medium"
                  minW="40px"
                  textAlign="center"
                  color="gray.700"
                >
                  {item.quantity}
                </Text>
                <IconButton
                  icon={<AddIcon />}
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  size="md"
                  colorScheme="blue"
                  variant="outline"
                  _hover={{
                    transform: 'scale(1.1)',
                    bg: 'blue.50'
                  }}
                  transition="all 0.2s"
                />
              </HStack>
            </VStack>
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => removeFromCart(item.id)}
              colorScheme="red"
              variant="ghost"
              size="lg"
              _hover={{
                bg: 'red.50',
                transform: 'scale(1.1)'
              }}
              transition="all 0.2s"
            />
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

const OrderSummary = ({ getCartTotal, handleCheckout }) => {
  OrderSummary.propTypes = {
    getCartTotal: PropTypes.func.isRequired,
    handleCheckout: PropTypes.func.isRequired
  };
  return (
    <Box
      w={{ base: 'full', lg: '400px' }}
      position={{ base: 'relative', lg: 'sticky' }}
      top={{ base: 0, lg: '20px' }}
      h="fit-content"
    >
      <Box
        borderWidth="1px"
        borderRadius="xl"
        p={8}
        bg="white"
        shadow="lg"
        _hover={{ shadow: 'xl' }}
        transition="all 0.3s"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6} color="gray.800" textAlign="center">
          Order Summary
        </Text>
        <Divider mb={6} />
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="lg" color="gray.600">
              Subtotal
            </Text>
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              ${getCartTotal().toFixed(2)}
            </Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="lg" color="gray.600">
              Shipping
            </Text>
            <Text fontSize="lg" color="green.500" fontWeight="semibold">
              Free
            </Text>
          </HStack>
          <Divider />
          <HStack justify="space-between" py={2}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Total
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              ${getCartTotal().toFixed(2)}
            </Text>
          </HStack>
          <Button
            colorScheme="blue"
            size="lg"
            width="full"
            mt={4}
            onClick={handleCheckout}
            height="60px"
            fontSize="xl"
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'lg'
            }}
            transition="all 0.2s"
          >
            Proceed to Checkout
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

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
    <div>
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
      <Container maxW="container.xl" py={8}>
        {cart.length === 0 && !cartLoading ? (
          <Container maxW="container.xl" py={10}>
            <Box
              textAlign="center"
              py={16}
              px={6}
              bg="white"
              shadow="lg"
              borderRadius="xl"
              maxW="600px"
              mx="auto"
              position="relative"
            >
              <Text fontSize="3xl" fontWeight="bold" mb={4} color="gray.700">
                Your cart is empty
              </Text>
              <Text mt={4} color="gray.500" fontSize="lg">
                Looks like you haven&apos;t added anything to your cart yet
              </Text>
              <Button
                as={Link}
                to="/"
                colorScheme="blue"
                size="lg"
                mt={8}
                px={8}
                py={6}
                fontSize="lg"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'lg'
                }}
                transition="all 0.2s"
              >
                Start Shopping
              </Button>
            </Box>
          </Container>
        ) : (
          <>
            <Container position="relative" maxW="container.xl" py={8}>
              <Button
                onClick={() => navigate(-1)}
                leftIcon={<ArrowBackIcon />}
                variant="ghost"
                colorScheme="blue"
                _hover={{ bg: 'blue.50' }}
                transition="all 0.2s"
                position="absolute"
                left={0}
              >
                Back to Products
              </Button>
              {cart.length > 0 && (
                <Text fontSize="4xl" fontWeight="bold" mb={8} color="gray.800" textAlign="center">
                  Your Shopping Cart
                </Text>
              )}
              <Box display="flex" gap={8} flexDirection={{ base: 'column', lg: 'row' }}>
                <CartItems
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  navigate={navigate}
                />
                <OrderSummary getCartTotal={getCartTotal} handleCheckout={handleCheckout} />
              </Box>
            </Container>
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
          </>
        )}
      </Container>
    </div>
  );
};
