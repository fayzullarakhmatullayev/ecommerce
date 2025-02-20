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
  const cartItemsCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
  const showCartFeatures = user && !user.isAdmin;

  return (
    <Box
      width="100%"
      bg="white"
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="sm"
      borderBottom="1px"
      borderColor="gray.100"
    >
      <Flex maxW="1400px" mx="auto" px={5} py={3} align="center">
        <Link to="/">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            bgGradient="linear(to-r, blue.500, blue.600)"
            bgClip="text"
            _hover={{ bgGradient: 'linear(to-r, blue.600, blue.700)' }}
            transition="all 0.3s ease"
          >
            E-Shop
          </Text>
        </Link>
        <Spacer />
        {showCartFeatures && (
          <Link to="/cart">
            <Button
              colorScheme="blue"
              variant="ghost"
              position="relative"
              mr={4}
              _hover={{ bg: 'blue.50' }}
              transition="all 0.2s"
            >
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
                  transform="scale(0.9)"
                  animation="fadeIn 0.2s ease-in"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>
        )}

        {user ? (
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="ghost"
              colorScheme="blue"
              _hover={{ bg: 'blue.50' }}
              _active={{ bg: 'blue.100' }}
              transition="all 0.2s"
            >
              {user.name || 'Account'}
            </MenuButton>
            <MenuList color="gray.800" shadow="lg" border="1px" borderColor="gray.100" p={2}>
              {user.isAdmin && (
                <MenuItem
                  as={Link}
                  to="/admin/dashboard"
                  _hover={{ bg: 'blue.50', color: 'blue.600' }}
                  borderRadius="md"
                  transition="all 0.2s"
                >
                  Admin Dashboard
                </MenuItem>
              )}
              {!user.isAdmin && (
                <MenuItem
                  as={Link}
                  to="/orders"
                  _hover={{ bg: 'blue.50', color: 'blue.600' }}
                  borderRadius="md"
                  transition="all 0.2s"
                >
                  Orders
                </MenuItem>
              )}
              <MenuItem
                as={Link}
                to="/profile"
                _hover={{ bg: 'blue.50', color: 'blue.600' }}
                borderRadius="md"
                transition="all 0.2s"
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={logout}
                color="red.500"
                _hover={{ bg: 'red.50', color: 'red.600' }}
                borderRadius="md"
                transition="all 0.2s"
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Link to="/login">
            <Button
              colorScheme="blue"
              variant="solid"
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'sm' }}
              transition="all 0.2s"
            >
              Login
            </Button>
          </Link>
        )}
      </Flex>
    </Box>
  );
};
