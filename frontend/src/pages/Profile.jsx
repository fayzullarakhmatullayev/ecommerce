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
  Center
} from '@chakra-ui/react';
import { useAuth } from '../context';
import axios from '../axios';

export function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);
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
    <Box p={4} maxW="container.sm" mx="auto">
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Profile Settings</Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                isDisabled={isLoading}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                isDisabled={isLoading}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" isLoading={isLoading}>
              Update Profile
            </Button>
          </VStack>
        </form>

        <Divider my={6} />

        <Heading size="md">Change Password</Heading>
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
              />
            </FormControl>
            <FormControl>
              <FormLabel>New Password</FormLabel>
              <Input
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                isDisabled={isLoading}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                isDisabled={isLoading}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" isLoading={isLoading}>
              Change Password
            </Button>
          </VStack>
        </form>

        <Divider my={6} />

        <Button colorScheme="red" onClick={() => setIsDeleteDialogOpen(true)} isLoading={isLoading}>
          Delete Account
        </Button>

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
    </Box>
  );
}
