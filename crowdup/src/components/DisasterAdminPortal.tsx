import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  TextInput,
  Textarea,
  Modal,
  Group,
  Title,
  Container,
  Select,
  Switch,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface Disaster {
  _id: string;
  type: string;
  coordinates: [number, number];
  description: string;
  city?: string; // New city field
}

interface DisasterFormProps {
  formData: Partial<Disaster>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Disaster>>>;
  handleSubmit: (e: React.FormEvent) => void;
  closeModal: () => void;
}

const DisasterAdminPanel: React.FC = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [formData, setFormData] = useState<Partial<Disaster>>({
    type: "",
    coordinates: [0, 0],
    description: "",
    city: "", // Initialize with empty city
    _id: "",
  });
  const [modalOpened, setModalOpened] = useState(false);

  const fetchDisasters = async () => {
    try {
      const response = await axios.get<Disaster[]>(
        "http://localhost:8000/disasters"
      );
      setDisasters(response.data);
    } catch (error) {
      console.error("Error fetching disasters:", error);
    }
  };

  useEffect(() => {
    fetchDisasters();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [latitude, longitude] = formData.coordinates as [number, number];
    const data = {
      type: formData.type,
      coordinates: [latitude, longitude],
      description: formData.description,
      city: formData.city, // Include city in payload
    };

    try {
      if (formData._id) {
        await axios.put(
          `http://localhost:8000/disasters/${formData._id}`,
          data
        );
      } else {
        await axios.post("http://localhost:8000/disasters", data);
      }
      setFormData({
        type: "",
        coordinates: [0, 0],
        description: "",
        city: "",
        _id: "",
      });
      setModalOpened(false);
      fetchDisasters();
    } catch (error) {
      console.error("Error saving disaster:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/disasters/${id}`);
      fetchDisasters();
    } catch (error) {
      console.error("Error deleting disaster:", error);
    }
  };

  const handleEdit = (disaster: Disaster) => {
    setFormData({
      type: disaster.type,
      coordinates: disaster.coordinates,
      description: disaster.description,
      city: disaster.city, // Populate city for editing
      _id: disaster._id,
    });
    setModalOpened(true);
  };

  return (
    <Container>
      <Title order={2} align="center" mb="md">
        Disaster Management Panel
      </Title>

      <Group position="center" mb="md">
        <Button onClick={() => setModalOpened(true)}>Add New Disaster</Button>
      </Group>

      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Type</th>
            <th>Coordinates</th>
            <th>Description</th>
            <th>City</th> {/* Add city column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {disasters.map((disaster) => (
            <tr key={disaster._id}>
              <td>{disaster.type}</td>
              <td>{disaster.coordinates.join(", ")}</td>
              <td>{disaster.description}</td>
              <td>{disaster.city || "N/A"}</td>{" "}
              {/* Display city if available */}
              <td>
                <Group spacing="xs">
                  <Button
                    onClick={() => handleEdit(disaster)}
                    size="xs"
                    variant="outline"
                    leftIcon={<IconEdit size={14} />}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(disaster._id)}
                    color="red"
                    size="xs"
                    leftIcon={<IconTrash size={14} />}
                  >
                    Delete
                  </Button>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={formData._id ? "Edit Disaster" : "Add Disaster"}
        centered
      >
        <DisasterForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleFormSubmit}
          closeModal={() => setModalOpened(false)}
        />
      </Modal>
    </Container>
  );
};

const DisasterForm: React.FC<DisasterFormProps> = ({
  formData,
  setFormData,
  handleSubmit,
  closeModal,
}) => {
  const [useCity, setUseCity] = useState(false);
  const [cityName, setCityName] = useState("");
  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const fetchCitySuggestions = async (query: string) => {
    if (query.length > 2) {
      try {
        const response = await axios.get(
          "https://api.opencagedata.com/geocode/v1/json",
          {
            params: {
              q: query,
              key: "c81153053cf44a4c84dae58aced9685b",
              limit: 5,
            },
          }
        );
        const options = response.data.results.map((result: any) => ({
          value: result.geometry.lat + "," + result.geometry.lng,
          label: result.formatted,
        }));
        setCityOptions(options);
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Select
        label="Disaster Type"
        placeholder="Select disaster type"
        value={formData.type || ""}
        onChange={(value) => setFormData({ ...formData, type: value || "" })}
        data={[
          { value: "flood", label: "Flood" },
          { value: "fire", label: "Fire" },
          { value: "earthquake", label: "Earthquake" },
        ]}
        required
        mb="sm"
      />
      <Switch
        label="Use City instead of Coordinates"
        checked={useCity}
        onChange={(e) => setUseCity(e.currentTarget.checked)}
        mb="sm"
      />

      {useCity ? (
        <>
          <TextInput
            label="City"
            placeholder="Enter city name"
            value={formData.city || ""}
            onChange={(e) => {
              setFormData({ ...formData, city: e.target.value });
              fetchCitySuggestions(e.target.value); // Fetch city suggestions
            }}
            required
            mb="sm"
          />
          <Select
            label="City Suggestions"
            placeholder="Select a city"
            value={formData.coordinates?.join(", ") || ""}
            onChange={(value: string) => {
              const coords = value.split(",").map(Number) as [number, number];
              setFormData({ ...formData, coordinates: coords });
            }}
            data={cityOptions}
            required
            mb="sm"
          />
        </>
      ) : (
        <TextInput
          label="Coordinates (Latitude, Longitude)"
          placeholder="e.g., 28.6139, 77.2090"
          value={(formData.coordinates || []).join(", ")}
          onChange={(e) => {
            const coords = e.target.value.split(",").map(Number) as [
              number,
              number
            ];
            setFormData({ ...formData, coordinates: coords });
          }}
          required
          mb="sm"
        />
      )}

      <Textarea
        label="Description"
        placeholder="Enter disaster description"
        value={formData.description || ""}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        required
        mb="sm"
      />

      <Group position="center" mt="md">
        <Button type="submit">{formData._id ? "Update" : "Submit"}</Button>
        <Button onClick={closeModal} variant="outline">
          Cancel
        </Button>
      </Group>
    </form>
  );
};

export default DisasterAdminPanel;
