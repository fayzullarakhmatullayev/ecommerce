import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Badge,
  Text,
  Stat
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import axios from '../../axios';
import { STORAGE_URL } from '../../constants';

export const AdminDashboard = () => {
  const [dailyStats, setDailyStats] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [daily, weekly, monthly, best] = await Promise.all([
          axios.get('/statistics/daily'),
          axios.get('/statistics/weekly'),
          axios.get('/statistics/monthly'),
          axios.get('/statistics/best-selling')
        ]);

        setDailyStats(daily.data);
        setWeeklyStats(weekly.data);
        setMonthlyStats(monthly.data);
        setBestSelling(best.data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box bg="gray.50" minH="100vh">
      <Heading mb={8} color="gray.700">
        Dashboard Overview
      </Heading>

      {/* Daily Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card
          bg="linear-gradient(45deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
          color="white"
          boxShadow="xl"
          borderRadius="xl"
          p={6}
        >
          <Stat>
            <StatLabel fontSize="lg" mb={2}>
              Daily Sales
            </StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold">
              ${dailyStats?.totalSales?.toFixed(2) || '0.00'}
            </StatNumber>
            <StatHelpText fontSize="md" opacity={0.8}>
              {dailyStats?.orderCount || 0} Orders Today
            </StatHelpText>
          </Stat>
        </Card>

        <Card
          bg="linear-gradient(45deg, #6D9EEB 0%, #A7BFE8 100%)"
          color="white"
          boxShadow="xl"
          borderRadius="xl"
          p={6}
        >
          <Stat>
            <StatLabel fontSize="lg" mb={2}>
              Weekly Revenue
            </StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold">
              ${weeklyStats.reduce((sum, stat) => sum + Number(stat.totalsales), 0).toFixed(2)}
            </StatNumber>
            <StatHelpText fontSize="md" opacity={0.8}>
              Past 7 Days
            </StatHelpText>
          </Stat>
        </Card>

        <Card
          bg="linear-gradient(45deg, #F6D365 0%, #FDA085 100%)"
          color="white"
          boxShadow="xl"
          borderRadius="xl"
          p={6}
        >
          <Stat>
            <StatLabel fontSize="lg" mb={2}>
              Monthly Revenue
            </StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold">
              ${monthlyStats.reduce((sum, stat) => sum + Number(stat.totalsales), 0).toFixed(2)}
            </StatNumber>
            <StatHelpText fontSize="md" opacity={0.8}>
              This Month
            </StatHelpText>
          </Stat>
        </Card>
      </SimpleGrid>

      {/* Charts Section */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <Card boxShadow="lg" borderRadius="xl" overflow="hidden">
          <CardHeader bg="white" p={6}>
            <Heading size="md" color="gray.700">
              Weekly Sales Trend
            </Heading>
          </CardHeader>
          <CardBody bg="white" pt={0} pb={4}>
            <Box h="400px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weeklyStats.map((stat) => ({
                    ...stat,
                    date: new Date(stat.date).toLocaleDateString(),
                    sales: Number(stat.totalsales)
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    name="Sales"
                    stroke="#4158D0"
                    strokeWidth={2}
                    dot={{ fill: '#4158D0', strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        <Card boxShadow="lg" borderRadius="xl" overflow="hidden">
          <CardHeader bg="white" p={6}>
            <Heading size="md" color="gray.700">
              Monthly Revenue
            </Heading>
          </CardHeader>
          <CardBody bg="white" pt={0} pb={4}>
            <Box h="400px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyStats.map((stat) => ({
                    ...stat,
                    date: new Date(stat.date).toLocaleDateString(),
                    sales: Number(stat.totalsales)
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sales" name="Revenue" fill="#00B4DB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Best Selling Products */}
      <Card boxShadow="lg" borderRadius="xl" overflow="hidden">
        <CardHeader bg="white" p={6}>
          <Heading size="md" color="gray.700">
            Best Selling Products
          </Heading>
        </CardHeader>
        <CardBody bg="white" p={0}>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th py={4}>Product</Th>
                  <Th py={4}>Category</Th>
                  <Th py={4} isNumeric>
                    Price
                  </Th>
                  <Th py={4} isNumeric>
                    Total Sold
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {bestSelling.map((product) => (
                  <Tr key={product.id} _hover={{ bg: 'gray.50' }}>
                    <Td>
                      <Box display="flex" alignItems="center">
                        {product.images?.[0] && (
                          <Image
                            src={STORAGE_URL + product.images[0].url}
                            alt={product.title}
                            boxSize="50px"
                            objectFit="cover"
                            mr={3}
                            borderRadius="md"
                            boxShadow="sm"
                          />
                        )}
                        <Text fontWeight="medium">{product.title}</Text>
                      </Box>
                    </Td>
                    <Td>
                      <Badge colorScheme="blue" fontSize="md" borderRadius="full" px={3} py={1}>
                        {product.category.name}
                      </Badge>
                    </Td>
                    <Td isNumeric fontWeight="medium">
                      <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                        ${product.price.toFixed(2)}
                      </Badge>
                    </Td>
                    <Td isNumeric>
                      <Badge colorScheme="green" borderRadius="full" fontSize="md" px={3} py={1}>
                        {product.totalSold} units
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};
