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
import { useProducts, useCart } from '../context';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import { STORAGE_URL } from '../constants';
import { ProductDescription } from '../components';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { getProductById, loading } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <Flex height="80vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

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
    <Box p={5} maxW="1200px" mx="auto">
      <Button mb={4} onClick={() => navigate(-1)}>
        Back to Products
      </Button>
      <HStack spacing={8} align="start">
        <Box flex={1} maxW={'50%'}>
          <Swiper
            modules={[Navigation, Pagination, Zoom]}
            navigation
            pagination={{ clickable: true }}
            zoom={{ maxRatio: 3 }}
            onClick={onOpen}
            style={{
              cursor: 'pointer',
              '--swiper-navigation-color': 'var(--chakra-colors-blue-500)',
              '--swiper-pagination-color': 'var(--chakra-colors-blue-500)',
              '--swiper-navigation-size': '24px',
              padding: '20px 10px',
              userSelect: 'none'
            }}
          >
            {product.images.map((image, index) => (
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
        <VStack flex={1} align="stretch" spacing={4}>
          <Text fontSize="2xl" fontWeight="bold">
            {product.title}
          </Text>
          <Text fontSize="xl" color="blue.500">
            ${product.price.toFixed(2)}
          </Text>
          <ProductDescription description={product.description} />
          <Button colorScheme="blue" size="lg" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </VStack>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
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
              {product.images.map((image, index) => (
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
  );
};
