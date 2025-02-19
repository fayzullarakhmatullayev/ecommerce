import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  SimpleGrid,
  Spinner,
  Text,
  Heading,
  Flex,
  Input,
  HStack,
  Button,
  ButtonGroup,
  Select
} from '@chakra-ui/react';
import { useProducts, useCart, useCategories } from '../context';
import { ProductCard, FilterSidebar } from '../components';
import { useDebounce, useQuery } from '../hooks';
import { MAX_PRICE, MIN_PRICE } from '../constants';

export const ProductList = () => {
  const {
    products = [],
    loading: productsLoading,
    error: productsError,
    fetchProducts
  } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { addToCart } = useCart();
  const { getQueryParams, setQueryParams } = useQuery();

  const initialParams = getQueryParams();
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category || 'all');
  const [priceRange, setPriceRange] = useState(initialParams.priceRange || [MIN_PRICE, MAX_PRICE]);
  const [searchQuery, setSearchQuery] = useState(initialParams.search || '');
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(parseInt(initialParams.page) || 1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedFetchProducts = useCallback(
    useDebounce((filters) => {
      fetchProducts(filters).then((data) => {
        setTotalPages(data.pagination.totalPages);
      });
    }, 300),
    [fetchProducts]
  );

  const fetchFilteredProducts = useCallback(() => {
    const filters = {
      category: selectedCategory,
      minPrice: priceRange[0] === 0 ? undefined : priceRange[0],
      maxPrice: priceRange[1] === 1000 ? undefined : priceRange[1],
      search: searchQuery.trim(),
      page: currentPage,
      limit: pageSize
    };
    setQueryParams({
      category: filters.category === 'all' ? undefined : filters.category,
      priceRange: filters.minPrice || filters.maxPrice ? priceRange : undefined,
      search: filters.search || undefined,
      page: currentPage,
      limit: pageSize
    });
    debouncedFetchProducts(filters);
  }, [selectedCategory, searchQuery, priceRange, currentPage, pageSize, setQueryParams]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (productsLoading || categoriesLoading)
    return (
      <Flex height="80vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  if (productsError || categoriesError)
    return <Text color="red.500">{productsError || categoriesError}</Text>;

  return (
    <Box p={5} maxW="1400px" mx="auto">
      <HStack mb={6} justify="space-between" align="center">
        <Heading>Our Products</Heading>
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          width="300px"
          size="lg"
        />
      </HStack>

      <Flex gap={6}>
        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        <Box flex={1}>
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {products.length === 0 ? (
              <Box gridColumn="1/-1" textAlign="center" py={10}>
                <Text fontSize="xl" color="gray.600">
                  No products found matching your filters
                </Text>
              </Box>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))
            )}
          </SimpleGrid>

          {products.length > 0 && (
            <Flex justify="space-between" align="center" mt={8}>
              <HStack spacing={2}>
                <Text>Items per page:</Text>
                <Select value={pageSize} onChange={handlePageSizeChange} w="100px">
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                </Select>
              </HStack>
              <ButtonGroup variant="outline" spacing={2}>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  isDisabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    colorScheme={currentPage === index + 1 ? 'blue' : 'gray'}
                    variant={currentPage === index + 1 ? 'solid' : 'outline'}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  isDisabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </ButtonGroup>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
