import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Divider,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Image
} from '@chakra-ui/react';
import confetti from 'canvas-confetti';
import { useState } from 'react';
import { useCart } from '../context';
import { OrderService } from '../services/OrderService';
import { STORAGE_URL } from '../constants';

import PropTypes from 'prop-types';

export const CheckoutModal = ({ isOpen, onClose }) => {
  CheckoutModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };
  const { cart, getCartTotal, clearCart } = useCart();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fake card info for demonstration
  const fakeCardInfo = {
    cardNumber: '4111 1111 1111 1111',
    expiryDate: '12/25',
    cvv: '123'
  };

  const handlePlaceOrder = async () => {
    try {
      setIsSubmitting(true);

      // Create order with cart items
      const response = await OrderService.createOrder({
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: getCartTotal()
      });

      if (response) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        toast({
          title: 'Order placed successfully!',
          description: 'Thank you for your purchase.',
          status: 'success',
          duration: 3000,
          isClosable: true
        });

        clearCart();
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Failed to place order',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Checkout</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Order Summary */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={4}>
                Order Summary
              </Text>
              <VStack spacing={4} align="stretch">
                {cart.map((item) => (
                  <HStack key={item.id} spacing={4}>
                    <Image
                      src={STORAGE_URL + item.product.images[0]?.url}
                      alt={item.product.title}
                      boxSize="50px"
                      objectFit="contain"
                    />
                    <Box flex={1}>
                      <Text fontWeight="medium">{item.product.title}</Text>
                      <Text fontSize="sm" color="gray.600">
                        Quantity: {item.quantity}
                      </Text>
                    </Box>
                    <Text fontWeight="medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            <Divider />

            {/* Payment Information */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={4}>
                Payment Information
              </Text>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Card Number</FormLabel>
                  <Input value={fakeCardInfo.cardNumber} isReadOnly />
                </FormControl>
                <HStack spacing={4} width="full">
                  <FormControl>
                    <FormLabel>Expiry Date</FormLabel>
                    <Input value={fakeCardInfo.expiryDate} isReadOnly />
                  </FormControl>
                  <FormControl>
                    <FormLabel>CVV</FormLabel>
                    <Input value={fakeCardInfo.cvv} isReadOnly />
                  </FormControl>
                </HStack>
              </VStack>
            </Box>

            <Divider />

            {/* Total */}
            <HStack justify="space-between">
              <Text fontSize="xl" fontWeight="bold">
                Total
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">
                ${getCartTotal().toFixed(2)}
              </Text>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handlePlaceOrder}
            isLoading={isSubmitting}
            loadingText="Placing Order"
          >
            Place Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
