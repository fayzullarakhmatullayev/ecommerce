import {
  Box,
  Flex,
  Spacer,
  Button,
  Text,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useCart, useAuth } from '../context';

export const NavBar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Box width="100%" bg="blue.500" position="sticky" top={0} zIndex={1000}>
      <Flex maxW="1400px" mx="auto" px={5} py={4} color="white">
        <Link to="/">
          <Text fontSize="xl" fontWeight="bold">
            E-Shop
          </Text>
        </Link>
        <Spacer />
        <Link to="/cart">
          <Button colorScheme="whiteAlpha" position="relative" mr={4}>
            Cart
            {cartItemsCount > 0 && (
              <Badge
                colorScheme="red"
                position="absolute"
                top="-2"
                right="-2"
                borderRadius="full"
                fontSize="xs"
                px={2}
              >
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </Link>

        {user ? (
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              colorScheme="blue"
              variant="solid"
            >
              {user.name || 'Account'}
            </MenuButton>
            <MenuList color="gray.800">
              {user.isAdmin && (
                <MenuItem as={Link} to="/admin/products" _hover={{ color: 'gray.800' }}>
                  Admin Dashboard
                </MenuItem>
              )}
              <MenuItem as={Link} to="/profile" _hover={{ color: 'gray.800' }}>
                Profile
              </MenuItem>
              <MenuItem onClick={logout} color="red.500" _hover={{ color: 'red.500' }}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Link to="/login">
            <Button colorScheme="blue" variant="solid">
              Login
            </Button>
          </Link>
        )}
      </Flex>
    </Box>
  );
};
