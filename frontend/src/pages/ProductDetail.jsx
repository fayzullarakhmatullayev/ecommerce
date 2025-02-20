import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Spinner,
  useToast,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts, useCart, useAuth } from '../context';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import { STORAGE_URL } from '../constants';
import { ProductDescription } from '../components';
import { ArrowBackIcon } from '@chakra-ui/icons';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { loading, getProductById } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        toast({
          title: 'Error loading product',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true
        });
        navigate('/');
      }
    };
    fetchProduct();
  }, [id, navigate, toast]);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: 'Added to cart',
      description: `${product.title} has been added to your cart`,
      status: 'success',
      duration: 2000,
      isClosable: true
    });
  };

  return (
    <>
      {loading && (
        <Flex height="80vh" align="center" justify="center">
          <Spinner size="xl" />
        </Flex>
      )}
      {!product && (
        <Flex height="80vh" align="center" justify="center">
          <Text>Product is not found</Text>
        </Flex>
      )}

      <Box p={5} maxW="1200px" mx="auto">
        <Button
          mb={6}
          onClick={() => navigate(-1)}
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          colorScheme="blue"
          _hover={{ bg: 'blue.50' }}
          transition="all 0.2s"
        >
          Back to Products
        </Button>
        <HStack spacing={8} align="start" flexDirection={{ base: 'column', md: 'row' }}>
          <Box flex={1} maxW={{ base: '100%', md: '50%' }} w="100%">
            <Box
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="xl"
              overflow="hidden"
              bg="white"
              shadow="sm"
              _hover={{ shadow: 'md' }}
              transition="all 0.2s"
            >
              <Swiper
                modules={[Navigation, Pagination, Zoom]}
                navigation
                pagination={{ clickable: true }}
                zoom={{ maxRatio: 3 }}
                onClick={onOpen}
                style={{
                  cursor: 'zoom-in',
                  '--swiper-navigation-color': 'var(--chakra-colors-blue-500)',
                  '--swiper-pagination-color': 'var(--chakra-colors-blue-500)',
                  '--swiper-navigation-size': '24px',
                  padding: '20px 10px',
                  userSelect: 'none'
                }}
              >
                {product?.images.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: 'white',
                      borderRadius: '8px'
                    }}
                  >
                    <img
                      src={STORAGE_URL + image.url}
                      alt={`${product.title} - ${index + 1}`}
                      style={{
                        width: '100%',
                        maxHeight: '500px',
                        objectFit: 'contain',
                        padding: '10px'
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Box>
          <VStack flex={1} spacing={6} align="stretch">
            <Box
              p={6}
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="xl"
              bg="white"
              shadow="sm"
              _hover={{ shadow: 'md' }}
              transition="all 0.2s"
            >
              <Text
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight="bold"
                color="gray.800"
                mb={4}
                lineHeight="1.4"
              >
                {product?.title}
              </Text>
              <Text fontSize={{ base: 'xl', md: '2xl' }} color="blue.600" fontWeight="bold" mb={6}>
                ${product?.price.toFixed(2)}
              </Text>
              <Box mb={6}>
                <ProductDescription description={product?.description} />
              </Box>
              {user && !user.isAdmin && (
                <Button
                  size="lg"
                  colorScheme="blue"
                  width="full"
                  onClick={handleAddToCart}
                  _hover={{
                    transform: 'translateY(-2px)',
                    shadow: 'md'
                  }}
                  transition="all 0.2s"
                >
                  Add to Cart
                </Button>
              )}
            </Box>
          </VStack>
        </HStack>

        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
          <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(5px)" />
          <ModalContent bg="transparent" boxShadow="none">
            <ModalBody p={0}>
              <Swiper
                modules={[Navigation, Pagination, Zoom]}
                navigation
                pagination={{ clickable: true }}
                zoom={{ maxRatio: 5 }}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '--swiper-navigation-color': '#fff',
                  '--swiper-pagination-color': '#fff',
                  '--swiper-navigation-size': '24px',
                  padding: '20px 10px',
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  margin: '0 auto'
                }}
              >
                {product?.images.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <div className="swiper-zoom-container">
                      <img
                        src={STORAGE_URL + image.url}
                        alt={`${product.title} - ${index + 1}`}
                        style={{
                          width: '100%',
                          maxHeight: '90vh',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};
