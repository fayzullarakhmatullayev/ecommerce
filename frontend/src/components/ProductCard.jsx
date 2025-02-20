import { VStack, Image, Text, Button } from '@chakra-ui/react';
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
      spacing={3}
      align="stretch"
      _hover={{ shadow: 'md' }}
      bg="white"
      maxW={'100%'}
    >
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
                <Image
                  src={STORAGE_URL + image.url}
                  alt={`${product.title} - ${index + 1}`}
                  height="250px"
                  width="100%"
                  objectFit="contain"
                />
              </Link>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <Link to={`/product/${product.id}`}>
              <Image
                src={STORAGE_URL + product.image}
                alt={product.title}
                height="200px"
                width="100%"
                objectFit="contain"
              />
            </Link>
          </SwiperSlide>
        )}
      </Swiper>
      <VStack align="stretch" spacing={2} flex={1}>
        <Link to={`/product/${product.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          <Text fontWeight="bold" noOfLines={2} _hover={{ color: 'var(--chakra-colors-blue-500)' }}>
            {product.title}
          </Text>
        </Link>
        <Text>${product.price.toFixed(2)}</Text>
      </VStack>
      {user && !user.isAdmin && (
        <Button colorScheme="blue" onClick={() => onAddToCart(product)}>
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
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired
      })
    )
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired
};
