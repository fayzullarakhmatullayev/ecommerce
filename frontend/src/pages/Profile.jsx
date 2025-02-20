import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Divider,
  Spinner,
  Center,
  Card,
  CardBody,
  Container,
  Avatar,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { EditIcon, LockIcon, DeleteIcon } from '@chakra-ui/icons';
import { useAuth } from '../context';
import axios from '../axios';

export function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  // Move useColorModeValue hooks to the top
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const inputBgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
    }
  }, [user]);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put('/auth/profile', formData);
      toast({
        title: 'Profile updated',
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000
      });
      return;
    }
    setIsLoading(true);
    try {
      await axios.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast({
        title: 'Password updated successfully',
        status: 'success',
        duration: 3000
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: 'Error changing password',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete('/auth/profile');
      logout();
      navigate('/');
      toast({
        title: 'Account deleted',
        status: 'info',
        duration: 3000
      });
    } catch (error) {
      toast({
        title: 'Error deleting account',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (!user && !loading) {
    return (
      <Box p={4}>
        <Text>Please log in to view your profile.</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card
        borderRadius="xl"
        boxShadow="xl"
        bg={bgColor}
        overflow="hidden"
        transition="all 0.2s"
        _hover={{ boxShadow: '2xl' }}
      >
        <CardBody>
          <VStack spacing={8} align="stretch">
            <Flex justify="space-between" align="center">
              <Heading size="lg" color={textColor}>
                Profile Settings
              </Heading>
              <Avatar size="xl" name={user.name} bg="blue.500" color="white" />
            </Flex>

            <Card variant="outline" p={6}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <Flex gap={4}>
                    <FormControl flex={1}>
                      <FormLabel>Name</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        isDisabled={isLoading}
                        bg={inputBgColor}
                        _hover={{ borderColor: 'blue.400' }}
                      />
                    </FormControl>
                    <FormControl flex={1}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isDisabled={isLoading}
                        bg={inputBgColor}
                        _hover={{ borderColor: 'blue.400' }}
                      />
                    </FormControl>
                  </Flex>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                    leftIcon={<EditIcon />}
                    size="lg"
                    w="full"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    Update Profile
                  </Button>
                </VStack>
              </form>
            </Card>

            <Divider my={6} />

            <Card variant="outline" p={6}>
              <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
                <LockIcon />
                Change Password
              </Heading>
              <form onSubmit={handlePasswordSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Current Password</FormLabel>
                    <Input
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      isDisabled={isLoading}
                      bg={inputBgColor}
                      _hover={{ borderColor: 'blue.400' }}
                    />
                  </FormControl>
                  <Flex gap={4}>
                    <FormControl flex={1}>
                      <FormLabel>New Password</FormLabel>
                      <Input
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        isDisabled={isLoading}
                        bg={inputBgColor}
                        _hover={{ borderColor: 'blue.400' }}
                      />
                    </FormControl>
                    <FormControl flex={1}>
                      <FormLabel>Confirm New Password</FormLabel>
                      <Input
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        isDisabled={isLoading}
                        bg={inputBgColor}
                        _hover={{ borderColor: 'blue.400' }}
                      />
                    </FormControl>
                  </Flex>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                    leftIcon={<LockIcon />}
                    size="lg"
                    w="full"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    Change Password
                  </Button>
                </VStack>
              </form>
            </Card>

            <Divider my={6} />

            <Card variant="outline" p={6} borderColor="red.200">
              <VStack spacing={4} align="stretch">
                <Heading size="md" color="red.500" display="flex" alignItems="center" gap={2}>
                  <DeleteIcon />
                  Danger Zone
                </Heading>
                <Text color="gray.600">
                  Once you delete your account, there is no going back. Please be certain.
                </Text>
                <Button
                  colorScheme="red"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  isLoading={isLoading}
                  leftIcon={<DeleteIcon />}
                  size="lg"
                  variant="outline"
                  _hover={{
                    bg: 'red.50',
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg'
                  }}
                  transition="all 0.2s"
                >
                  Delete Account
                </Button>
              </VStack>
            </Card>

            <AlertDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
              leastDestructiveRef={undefined}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader>Delete Account</AlertDialogHeader>
                  <AlertDialogBody>Are you sure? This action cannot be undone.</AlertDialogBody>
                  <AlertDialogFooter>
                    <Button onClick={() => setIsDeleteDialogOpen(false)} mr={3}>
                      Cancel
                    </Button>
                    <Button colorScheme="red" onClick={handleDelete} isLoading={isLoading}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
}
