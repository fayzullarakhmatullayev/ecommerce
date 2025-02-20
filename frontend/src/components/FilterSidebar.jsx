import {
  Box,
  Text,
  Select,
  VStack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Button
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { MAX_PRICE, MIN_PRICE } from '../constants';

export const FilterSidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange
}) => {
  return (
    <Box
      w="280px"
      position="sticky"
      top="100px"
      alignSelf="flex-start"
      borderWidth="1px"
      borderRadius="xl"
      p={6}
      bg="white"
      shadow="md"
      _hover={{ shadow: 'lg' }}
      transition="all 0.2s"
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={3} color="gray.700">
            Category
          </Text>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            bg="gray.50"
            _hover={{ bg: 'gray.100' }}
            transition="all 0.2s"
            borderRadius="md"
          >
            <option value="all">All Categories</option>
            {(categories || []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </option>
            ))}
          </Select>
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={3} color="gray.700">
            Price Range
          </Text>
          <Text fontSize="md" mb={4} color="blue.600" fontWeight="medium">
            ${priceRange[0]} - ${priceRange[1]}
          </Text>
          <VStack spacing={6}>
            <RangeSlider
              aria-label={['min', 'max']}
              value={priceRange}
              onChange={setPriceRange}
              min={MIN_PRICE}
              max={MAX_PRICE}
              colorScheme="blue"
            >
              <RangeSliderTrack bg="blue.100">
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} boxSize={6} shadow="md" />
              <RangeSliderThumb index={1} boxSize={6} shadow="md" />
            </RangeSlider>

            <HStack spacing={4}>
              <NumberInput
                size="md"
                value={priceRange[0]}
                onChange={(value) => setPriceRange([Number(value), priceRange[1]])}
                min={0}
                max={priceRange[1]}
                borderRadius="md"
              >
                <NumberInputField bg="gray.50" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <NumberInput
                size="md"
                value={priceRange[1]}
                onChange={(value) => setPriceRange([priceRange[0], Number(value)])}
                min={priceRange[0]}
                max={MAX_PRICE}
                borderRadius="md"
              >
                <NumberInputField bg="gray.50" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
          </VStack>
        </Box>

        <Button
          colorScheme="blue"
          size="md"
          onClick={() => {
            setSelectedCategory('all');
            setPriceRange([MIN_PRICE, MAX_PRICE]);
          }}
          mt={2}
          w="full"
          variant="outline"
          _hover={{ bg: 'blue.50' }}
          transition="all 0.2s"
        >
          Reset Filters
        </Button>
      </VStack>
    </Box>
  );
};

FilterSidebar.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedCategory: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  priceRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  setPriceRange: PropTypes.func.isRequired
};
