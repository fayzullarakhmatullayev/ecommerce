import { VStack, Image, Text, Button, Box, Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { STORAGE_URL } from '../constants';
import { useAuth } from '../context';

export const ProductCard = ({ product, onAddToCart }) => {
  const { user } = useAuth();
  return (
    <VStack
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      spacing={4}
      align="stretch"
      transition="all 0.2s"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      bg="white"
      maxW={'100%'}
      position="relative"
    >
      <Box position="absolute" zIndex={10} top={2} right={2}>
        <Badge colorScheme="blue" borderRadius="full" px={3} py={1} fontSize="xs">
          {product.category?.name}
        </Badge>
      </Box>
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        style={{
          '--swiper-pagination-color': 'var(--chakra-colors-blue-500)',
          '--swiper-pagination-bullet-inactive-color': 'var(--chakra-colors-gray-300)',
          '--swiper-pagination-bullet-inactive-opacity': '1',
          '--swiper-pagination-bullet-size': '8px',
          '--swiper-pagination-bullet-horizontal-gap': '4px',
          width: '100%'
        }}
      >
        {Array.isArray(product.images) ? (
          product.images.map((image, index) => (
            <SwiperSlide key={index}>
              <Link to={`/product/${product.id}`}>
                <Box
                  borderRadius="md"
                  overflow="hidden"
                  bg="gray.50"
                  position="relative"
                  _after={{
                    content: '""',
                    display: 'block',
                    paddingBottom: '100%'
                  }}
                >
                  <Image
                    src={STORAGE_URL + image.url}
                    alt={`${product.title} - ${index + 1}`}
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    objectFit="contain"
                    p={4}
                  />
                </Box>
              </Link>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <Link to={`/product/${product.id}`}>
              <Box
                borderRadius="md"
                overflow="hidden"
                bg="gray.50"
                position="relative"
                _after={{
                  content: '""',
                  display: 'block',
                  paddingBottom: '100%'
                }}
              >
                <Image
                  src={STORAGE_URL + product.image}
                  alt={product.title}
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  objectFit="contain"
                  p={4}
                />
              </Box>
            </Link>
          </SwiperSlide>
        )}
      </Swiper>
      <VStack align="stretch" spacing={2} flex={1}>
        <Link to={`/product/${product.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          <Text
            fontWeight="semibold"
            fontSize="lg"
            noOfLines={2}
            _hover={{ color: 'blue.500' }}
            transition="color 0.2s"
          >
            {product.title}
          </Text>
        </Link>
        <Text fontSize="xl" fontWeight="bold" color="blue.600">
          ${product.price.toFixed(2)}
        </Text>
      </VStack>
      {user && !user.isAdmin && (
        <Button
          colorScheme="blue"
          onClick={() => onAddToCart(product)}
          size="lg"
          width="100%"
          _hover={{
            transform: 'translateY(-1px)',
            boxShadow: 'md'
          }}
          transition="all 0.2s"
        >
          Add to Cart
        </Button>
      )}
    </VStack>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired
      })
    )
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired
};
