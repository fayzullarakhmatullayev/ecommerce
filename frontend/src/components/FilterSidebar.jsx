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
      w="250px"
      position="sticky"
      top="100px"
      alignSelf="flex-start"
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      bg="white"
      shadow="sm"
    >
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontWeight="bold" mb={2}>
            Category
          </Text>
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {(categories || []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </option>
            ))}
          </Select>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={2}>
            Price Range
          </Text>
          <Text fontSize="sm" mb={2}>
            ${priceRange[0]} - ${priceRange[1]}
          </Text>
          <VStack spacing={4}>
            <RangeSlider
              aria-label={['min', 'max']}
              value={priceRange}
              onChange={setPriceRange}
              min={MIN_PRICE}
              max={MAX_PRICE}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>

            <HStack spacing={2}>
              <NumberInput
                size="sm"
                value={priceRange[0]}
                onChange={(value) => setPriceRange([Number(value), priceRange[1]])}
                min={0}
                max={priceRange[1]}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <NumberInput
                size="sm"
                value={priceRange[1]}
                onChange={(value) => setPriceRange([priceRange[0], Number(value)])}
                min={priceRange[0]}
                max={MAX_PRICE}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
          </VStack>
        </Box>

        <Button
          colorScheme="gray"
          size="sm"
          onClick={() => {
            setSelectedCategory('all');
            setPriceRange([MIN_PRICE, MAX_PRICE]);
          }}
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
