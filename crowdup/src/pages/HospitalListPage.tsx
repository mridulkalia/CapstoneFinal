import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  Table,
  TextInput,
  Button,
  Container,
  Title,
  Group,
  Loader,
  Pagination,
  Modal,
  Card,
  Text,
  Grid,
  Divider,
  Textarea,
} from "@mantine/core";
import { Badge } from "tabler-icons-react";

interface Inventory {
  items: Item[]; // Array of inventory items (Item objects)
}

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

interface Item {
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  condition: string;
  priority: number;
}

const HospitalListPage: React.FC = () => {
  const [loadingInventory, setLoadingInventory] = useState<boolean>(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [sortOption, setSortOption] = useState<string | null>("");
  const [filterField, setFilterField] = useState<string | null>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search state
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null
  ); // State to store inventory
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [contactFormOpened, setContactFormOpened] = useState<boolean>(false);

  const pageSize = 14;

  useEffect(() => {
    fetchHospitals();
  }, [sortOption, filterField, filterValue, searchQuery, currentPage]);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/hospitals", {
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
      console.error("Error fetching hospitals:", error);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };
  const ContactForm = ({ selectedHospital }: { selectedHospital: any }) => {
    const [message, setMessage] = useState(""); // Message content
    const [subject, setSubject] = useState("Hospital Inquiry"); // Subject of the email

    // Function to handle the form submission
    const handleContactUs = async () => {
        if (selectedHospital) {
          try {
            // Prepare the payload for sending the email
            const payload = {
              hospitalEmail: selectedHospital.email, // Ensure this matches the field in the backend
              message: message, // Message from the form
            };
      
            console.log("Sending email with payload:", payload); // Log the payload to verify the data
      
            const response = await axios.post(
              "http://localhost:8000/send-email", // Ensure this endpoint is correct in the backend
              payload
            );
      
            if (response.status === 200) {
              alert("Email sent successfully to the hospital!");
              setMessage(""); // Reset the message after successful submission
              setModalOpened(false); // Close the modal
            } else {
              alert("Failed to send email.");
            }
          } catch (error) {
            console.error("Detailed error:", error); // This will print the full error
            if (error instanceof Error) {
              alert(`Error sending email: ${error.message}`);
            } else {
              alert('Error sending email');
            }
          }
        }
      };
      

    return (
      <Modal
        opened={contactFormOpened}
        onClose={() => setContactFormOpened(false)}
        title="Contact Hospital"
        centered
      >
        {selectedHospital && (
          <>
            <TextInput
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter the subject"
            />
            <Textarea
              label="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              minRows={4}
              required
            />
            <Group position="right" mt="md">
              <Button onClick={handleContactUs}>Send Message</Button>
            </Group>
          </>
        )}
      </Modal>
    );
  };

  const handleSort = (column: string) => {
    if (column === "inventoryScore") {
      if (sortOption === column) {
        setSortOption(`${column}_desc`);
      } else if (sortOption === `${column}_desc`) {
        setSortOption(""); // Reset to no sort
      } else {
        setSortOption(column);
      }
    } else {
      setSortOption(sortOption === column ? `${column}_desc` : column);
    }
  };

  const getRowColor = (score: number) => {
    if (score >= 20) return "#2c6b2f"; // Slightly lighter than #1b5e20
    if (score >= 15) return "#4caf50"; // Slightly lighter than #388e3c
    if (score >= 10) return "#66bb6a";
    if (score >= 5) return "#81c784";
    if (score >= 0) return "#a8e6a0";
    return "#e8f5e9"; // Default color for negative values or invalid
  };

  const handleRowClick = async (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setLoadingInventory(true);
    try {
      const inventoryResponse = await axios.get(
        `http://localhost:8000/inventory/${hospital.registrationNumber}`
      );
      console.log(inventoryResponse.data);
      if (inventoryResponse.data.inventoryItems) {
        // Ensure inventoryItems matches the Item[] structure
        setSelectedInventory({
          items: inventoryResponse.data.inventoryItems, // This should be an array of Item objects
        });
      } else {
        setSelectedInventory(null);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setSelectedInventory(null);
    } finally {
      setLoadingInventory(false);
    }
    setModalOpened(true);
  };

  return (
    <Container size="lg" mt="xl">
      <Title
        order={2}
        align="center"
        style={{
          fontFamily: "Poppins, sans-serif",
          color: "#2c3e50",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        All Hospitals / NGOs
      </Title>
      <Group mt="md" position="apart" style={{ marginBottom: "1rem" }}>
        <Group style={{ gap: "1rem" }}>
          <Select
            label="Sort By"
            placeholder="Choose sorting"
            value={sortOption}
            onChange={setSortOption}
            data={[
              { value: "name", label: "Name" },
              { value: "city", label: "City" },
              { value: "registrationNumber", label: "Registration Number" },
              { value: "inventoryScore", label: "Inventory Score" },
            ]}
            style={{ width: 220 }}
            radius="md"
            styles={{
              input: { borderColor: "#1abc9c" },
              label: { color: "#34495e" },
            }}
          />
          <Select
            label="Filter By"
            placeholder="Choose filter"
            value={filterField}
            onChange={setFilterField}
            data={[
              { value: "city", label: "City" },
              { value: "status", label: "Status" },
              { value: "country", label: "Country" },
            ]}
            style={{ width: 220 }}
            radius="md"
            styles={{
              input: { borderColor: "#3498db" },
              label: { color: "#34495e" },
            }}
          />
          <TextInput
            label="Filter Value"
            placeholder="Enter filter value"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={{ width: 220 }}
            radius="md"
            styles={{
              input: { borderColor: "#9b59b6" },
              label: { color: "#34495e" },
            }}
          />
          <TextInput
            label="Search Hospitals"
            placeholder="Enter name or registration number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 220 }}
            radius="md"
            styles={{
              input: { borderColor: "#9b59b6" },
              label: { color: "#34495e" },
            }}
          />
          <Button
            onClick={fetchHospitals}
            variant="filled"
            color="teal"
            radius="md"
            style={{ height: "42px", alignSelf: "flex-end" }}
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
            <Table
              striped
              highlightOnHover
              mt="xl"
              verticalSpacing="sm"
              horizontalSpacing="lg"
              withBorder
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Registration Number</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Country</th>
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
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e0f7fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = getRowColor(
                        hospital.inventoryScore
                      ))
                    }
                  >
                    <td>{hospital.name}</td>
                    <td>{hospital.registrationNumber}</td>
                    <td>{hospital.email}</td>
                    <td>{hospital.city}</td>
                    <td>{hospital.country}</td>
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
        // title={selectedHospital?.name}
        centered
        size="lg"
      >
        {selectedHospital && (
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Grid>
              {/* Hospital Info */}
              <Grid.Col span={12}>
                <Text align="center" weight={600} size="xl" color="teal">
                  {selectedHospital.name}
                </Text>
                <Text align="center" size="md" color="gray">
                  {selectedHospital.city}, {selectedHospital.country}
                </Text>
                <Group position="center" mt="xs">
                  <Badge color="green">
                    {selectedHospital.inventoryScore} Inventory Score
                  </Badge>
                </Group>
              </Grid.Col>

              {/* Divider */}
              <Grid.Col span={12}>
                <Divider my="sm" />
              </Grid.Col>

              {/* Hospital Details */}
              <Grid.Col span={6}>
                <Text weight={500}>Email:</Text>
                <Text>{selectedHospital.email}</Text>
                <Text weight={500}>Phone:</Text>
                <Text>{selectedHospital.phone}</Text>
                <Text weight={500}>Address:</Text>
                <Text>{selectedHospital.address}</Text>
                <Text weight={500}>Contact Person:</Text>
                <Text>{selectedHospital.contactPerson}</Text>
                <Text weight={500}>Contact Person Phone:</Text>
                <Text>{selectedHospital.contactPersonPhone}</Text>
                <Text weight={500}>Description:</Text>
                <Text>{selectedHospital.description}</Text>
              </Grid.Col>

              {/* Inventory Details */}
              <Grid.Col span={12}>
                <Text align="center" weight={500} size="lg" mt="md">
                  Inventory Details
                </Text>
                {loadingInventory ? (
                  <Loader size="lg" color="teal" />
                ) : selectedInventory?.items &&
                  selectedInventory.items.length > 0 ? (
                  <Table striped highlightOnHover>
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Condition</th>
                        <th>Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInventory.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.itemName || "N/A"}</td>
                          <td>{item.category || "N/A"}</td>
                          <td>{item.quantity || "N/A"}</td>
                          <td>{item.unit || "N/A"}</td>
                          <td>{item.condition || "N/A"}</td>
                          <td>{item.priority || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Text>No inventory available or loading...</Text>
                )}
              </Grid.Col>

              {/* Action Buttons */}
              <Grid.Col span={12} mt="xl">
                <Group position="center">
                  <Button onClick={() => setContactFormOpened(true)}>
                    Contact Now
                  </Button>
                  <Button variant="filled" color="teal" size="lg">
                    Donate Now
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
            <ContactForm selectedHospital={selectedHospital} />
          </Card>
        )}
      </Modal>
    </Container>
  );
};

export default HospitalListPage;
