import { Box, Flex, VStack, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/products', label: 'Products' },
    { path: '/admin/categories', label: 'Categories' },
    { path: '/admin/orders', label: 'Orders' }
  ];

  return (
    <Flex minH="calc(100vh - 72px)">
      <Box
        w="250px"
        bg="white"
        color="gray.700"
        py={8}
        px={4}
        position="sticky"
        top="72px"
        h="calc(100vh - 72px)"
        borderRightWidth="1px"
        borderRightColor="gray.200"
        shadow="md"
      >
        <VStack spacing={4} align="stretch">
          {navItems.map((item) => (
            <ChakraLink
              key={item.path}
              as={Link}
              to={item.path}
              p={3}
              borderRadius="md"
              _hover={{ bg: 'gray.200', color: 'gray.800' }}
              bg={location.pathname === item.path ? 'gray.100' : 'transparent'}
            >
              <Text fontWeight="medium">{item.label}</Text>
            </ChakraLink>
          ))}
        </VStack>
      </Box>
      <Box flex="1" p={8} bg="gray.50">
        <Outlet />
      </Box>
    </Flex>
  );
};
