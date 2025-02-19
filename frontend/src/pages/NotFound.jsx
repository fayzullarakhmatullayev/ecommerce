import { Box, Heading, Text, Button, VStack, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Box minH="92vh" display="flex" alignItems="center" justifyContent="center" bg={bgColor} px={4}>
      <VStack spacing={8} textAlign="center">
        <Heading
          display="inline-block"
          size="4xl"
          bgGradient="linear(to-r, blue.400, blue.600)"
          backgroundClip="text"
          fontSize="9xl"
        >
          404
        </Heading>
        <Heading as="h2" size="xl" mb={2}>
          Page Not Found
        </Heading>
        <Text fontSize="lg" color="gray.500">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </Text>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => navigate('/')}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
          }}
        >
          Go to Homepage
        </Button>
      </VStack>
    </Box>
  );
};
