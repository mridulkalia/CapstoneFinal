import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, Table, TextInput, Button, Container, Title, Group, Loader, Pagination, ActionIcon, Tooltip, Modal, Card } from '@mantine/core';
import { ArrowUp, ArrowDown } from 'tabler-icons-react';

interface Hospital {
    name: string;
    registrationNumber: string;
    email: string;
    phone: string; // Added this line
    city: string;
    country: string;
    address: string; // Added this line
    contactPerson: string; // Added this line
    contactPersonPhone: string; // Added this line
    certificate: string; // Added this line
    description: string; // Added this line
    status: string;
    inventoryScore: number;
}

const HospitalListPage: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [sortOption, setSortOption] = useState<string | null>('');
  const [filterField, setFilterField] = useState<string | null>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  const pageSize = 15;

  useEffect(() => {
    fetchHospitals();
  }, [sortOption, filterField, filterValue, currentPage]);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/hospitals', {
        params: {
          sortBy: sortOption,
          filterBy: filterField,
          filterValue: filterValue,
          page: currentPage,
          pageSize: pageSize,
        },
      });
  
      const { hospitals = [], totalPages = 1 } = response.data;
      setHospitals(hospitals);
      setTotalPages(totalPages);
      hospitals.forEach((hospital: Hospital) => {
        console.log(hospital.registrationNumber);
      });
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortOption === column) {
      setSortOption(`${column}_desc`);
    } else {
      setSortOption(column);
    }
  };

  const getRowColor = (score: number) => {
    if (score >= 0) return '#d4edda';
    if (score >= 5) return '#a8df8e';
    if (score >= 4) return '#77c379';
    if (score >= 10) return '#4caf50';
    if (score >= 20) return '#2e7d32';
    return '#1b5e20';
  };

  const handleRowClick = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setModalOpened(true);
  };

  return (
    <Container size="lg" mt="xl">
      <Title
        order={2}
        align="center"
        style={{ fontFamily: 'Poppins, sans-serif', color: '#2c3e50', fontWeight: 'bold', marginBottom: '1rem' }}
      >
        All Hospitals / NGOs
      </Title>
      <Group mt="md" position="apart" style={{ marginBottom: '1rem' }}>
        <Group style={{ gap: '1rem' }}>
          <Select
            label="Sort By"
            placeholder="Choose sorting"
            value={sortOption}
            onChange={setSortOption}
            data={[
              { value: 'name', label: 'Name' },
              { value: 'city', label: 'City' },
              { value: 'registrationNumber', label: 'Registration Number' },
              { value: 'inventoryScore', label: 'Inventory Score' },
            ]}
            style={{ width: 220 }}
            radius="md"
            styles={{ input: { borderColor: '#1abc9c' }, label: { color: '#34495e' } }}
          />
          <Select
            label="Filter By"
            placeholder="Choose filter"
            value={filterField}
            onChange={setFilterField}
            data={[
              { value: 'city', label: 'City' },
              { value: 'status', label: 'Status' },
              { value: 'country', label: 'Country' },
            ]}
            style={{ width: 220 }}
            radius="md"
            styles={{ input: { borderColor: '#3498db' }, label: { color: '#34495e' } }}
          />
          <TextInput
            label="Filter Value"
            placeholder="Enter filter value"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={{ width: 220 }}
            radius="md"
            styles={{ input: { borderColor: '#9b59b6' }, label: { color: '#34495e' } }}
          />
          <Button
            onClick={fetchHospitals}
            variant="filled"
            color="teal"
            radius="md"
            style={{ height: '42px', alignSelf: 'flex-end' }}
          >
            Apply Filters
          </Button>
        </Group>
      </Group>

      {loading ? (
        <Group position="center" mt="xl">
          <Loader size="xl" color="teal" />
        </Group>
      ) : (
        <>
          {hospitals.length > 0 ? (
            <Table striped highlightOnHover mt="xl" verticalSpacing="sm" horizontalSpacing="lg" withBorder>
              <thead>
                <tr>
                  <th>
                    <Tooltip label="Sort by Name">
                      <ActionIcon onClick={() => handleSort('name')}>
                        {sortOption === 'name' ? <ArrowDown /> : <ArrowUp />}
                      </ActionIcon>
                    </Tooltip>
                    Name
                  </th>
                  <th>
                    <Tooltip label="Sort by Registration Number">
                      <ActionIcon onClick={() => handleSort('registrationNumber')}>
                        {sortOption === 'registrationNumber' ? <ArrowDown /> : <ArrowUp />}
                      </ActionIcon>
                    </Tooltip>
                    Registration Number
                  </th>
                  <th>Email</th>
                  <th>
                    <Tooltip label="Sort by City">
                      <ActionIcon onClick={() => handleSort('city')}>
                        {sortOption === 'city' ? <ArrowDown /> : <ArrowUp />}
                      </ActionIcon>
                    </Tooltip>
                    City
                  </th>
                  <th>Country</th>
                  <th>Status</th>
                  <th>
                    <Tooltip label="Sort by Inventory Score">
                      <ActionIcon onClick={() => handleSort('inventoryScore')}>
                        {sortOption === 'inventoryScore' ? <ArrowDown /> : <ArrowUp />}
                      </ActionIcon>
                    </Tooltip>
                    Inventory Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((hospital) => (
                  <tr
                    key={hospital.registrationNumber}
                    onClick={() => handleRowClick(hospital)}
                    style={{
                      backgroundColor: getRowColor(hospital.inventoryScore),
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0f7fa')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = getRowColor(hospital.inventoryScore))}
                  >
                    <td>{hospital.name}</td>
                    <td>{hospital.registrationNumber}</td>
                    <td>{hospital.email}</td>
                    <td>{hospital.city}</td>
                    <td>{hospital.country}</td>
                    <td>{hospital.status}</td>
                    <td>{hospital.inventoryScore}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Group position="center" mt="xl">
              <Title order={3}>No hospitals found.</Title>
            </Group>
          )}

          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
            position="center"
            mt="md"
          />
        </>
      )}

<Modal
  opened={modalOpened}
  onClose={() => setModalOpened(false)}
  title={selectedHospital?.name}
  centered
  size="lg"
>
  {selectedHospital && (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <strong>Name:</strong> {selectedHospital.name}
        </div>
        <div>
          <strong>Registration Number:</strong> {selectedHospital.registrationNumber}
        </div>
        <div>
          <strong>Email:</strong> {selectedHospital.email}
        </div>
        <div>
          <strong>Phone:</strong> {selectedHospital.phone}
        </div>
        <div>
          <strong>City:</strong> {selectedHospital.city}
        </div>
        <div>
          <strong>Country:</strong> {selectedHospital.country}
        </div>
        <div>
          <strong>Address:</strong> {selectedHospital.address}
        </div>
        <div>
          <strong>Contact Person:</strong> {selectedHospital.contactPerson}
        </div>
        <div>
          <strong>Contact Person Phone:</strong> {selectedHospital.contactPersonPhone}
        </div>
        <div>
          <strong>Description:</strong> {selectedHospital.description}
        </div>
      </div>
    </Card>
  )}
</Modal>


    </Container>
  );
};

export default HospitalListPage;
