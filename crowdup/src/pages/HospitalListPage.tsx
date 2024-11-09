import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, Table, TextInput, Button, Container, Title, Group, Loader, Pagination, Modal, Card } from '@mantine/core';

interface Hospital {
    name: string;
    registrationNumber: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    address: string;
    contactPerson: string;
    contactPersonPhone: string;
    certificate: string;
    description: string;
    status: string;
    inventoryScore: number;
}

const HospitalListPage: React.FC = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [sortOption, setSortOption] = useState<string | null>('');
    const [filterField, setFilterField] = useState<string | null>('');
    const [filterValue, setFilterValue] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>(''); // Search state
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
    const [modalOpened, setModalOpened] = useState<boolean>(false);

    const pageSize = 14;

    useEffect(() => {
        fetchHospitals();
    }, [sortOption, filterField, filterValue, searchQuery, currentPage]);

    const fetchHospitals = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/hospitals', {
                params: {
                    sortBy: sortOption,
                    page: currentPage,
                    pageSize: pageSize,
                    searchQuery: searchQuery,
                },
            });
            const { hospitals = [], totalPages = 1 } = response.data;
            setHospitals(hospitals);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
            setHospitals([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (column: string) => {
        if (column === 'inventoryScore') {
            if (sortOption === column) {
                setSortOption(`${column}_desc`);
            } else if (sortOption === `${column}_desc`) {
                setSortOption(''); // Reset to no sort
            } else {
                setSortOption(column);
            }
        } else {
            setSortOption(sortOption === column ? `${column}_desc` : column);
        }
    };

    const getRowColor = (score: number) => {
        if (score >= 20) return '#2c6b2f';  // Slightly lighter than #1b5e20
        if (score >= 15) return '#4caf50';  // Slightly lighter than #388e3c
        if (score >= 10) return '#66bb6a';
        if (score >= 5) return '#81c784';
        if (score >= 0) return '#a8e6a0';
        return '#e8f5e9';                // Default color for negative values or invalid
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
                    <TextInput
                        label="Search Hospitals"
                        placeholder="Enter name or registration number"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                                    <th>Name</th>
                                    <th>Registration Number</th>
                                    <th>Email</th>
                                    <th>City</th>
                                    <th>Country</th>
                                    <th>Status</th>
                                    <th>Inventory Score</th>
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
                            <div><strong>Name:</strong> {selectedHospital.name}</div>
                            <div><strong>Registration Number:</strong> {selectedHospital.registrationNumber}</div>
                            <div><strong>Email:</strong> {selectedHospital.email}</div>
                            <div><strong>Phone:</strong> {selectedHospital.phone}</div>
                            <div><strong>City:</strong> {selectedHospital.city}</div>
                            <div><strong>Country:</strong> {selectedHospital.country}</div>
                            <div><strong>Address:</strong> {selectedHospital.address}</div>
                            <div><strong>Contact Person:</strong> {selectedHospital.contactPerson}</div>
                            <div><strong>Contact Person Phone:</strong> {selectedHospital.contactPersonPhone}</div>
                            <div><strong>Certificate:</strong> {selectedHospital.certificate}</div>
                            <div><strong>Description:</strong> {selectedHospital.description}</div>
                        </div>
                    </Card>
                )}
            </Modal>
        </Container>
    );
};

export default HospitalListPage;
