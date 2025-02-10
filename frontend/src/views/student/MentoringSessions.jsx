import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import BaseHeader from '../partials/BaseHeader';
import BaseFooter from '../partials/BaseFooter';

function MentoringSessions() {
    const [sessions, setSessions] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [formData, setFormData] = useState({
        mentorId: "",
        date: "",
        time: "",
        goals: "",
    });

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/v1/teachers/");
                console.log("Mentors Data:", response.data);
                setMentors(response.data);
            } catch (error) {
                console.error("Error fetching mentors:", error);
            }
        };

        const fetchSessions = async () => {
            const token = localStorage.getItem("token");
        
            if (!token) {
                console.error("No authentication token found.");
                return;
            }
        
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/v1/mentoring-sessions/",
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("Sessions fetched successfully:", response.data);
                setSessions(response.data);
                setLoading(false); // ✅ Stop loading once data is set
            } catch (error) {
                console.error("Error fetching sessions:", error.response ? error.response.data : error);
                setLoading(false); // ✅ Ensure loading stops even on failure
            }
        };
        

        fetchMentors();
        fetchSessions();
    }, []);

    useEffect(() => {
        if (!loading) {  // ✅ Run filtering only after data is loaded
            const filtered = sessions.filter((session) => {
                const matchesSearch =
                    session.title.toLowerCase().includes(searchQuery) ||
                    session.mentor?.full_name.toLowerCase().includes(searchQuery);
                const matchesFilter =
                    filterStatus === "all" || session.status === filterStatus;
                return matchesSearch && matchesFilter;
            });
            setFilteredSessions(filtered);
        }
    }, [sessions, searchQuery, filterStatus, loading]);
    
    const handleBooking = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No authentication token found. Please log in again.");
            return;
        }

        try {
            const response = await axios.post(
                '/api/v1/mentoring-sessions/',
                formData,
                {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            alert("Session booked successfully!");
            setShowBookingModal(false);

            // Refetch sessions after booking
            const sessionsResponse = await axios.get('/api/v1/mentoring-sessions/');
            setSessions(sessionsResponse.data);
        } catch (error) {
            console.error("Error booking session:", error);
            alert("Failed to book session. Please try again.");
        }
    };

    const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());
    const handleFilterChange = (e) => setFilterStatus(e.target.value);

    return (
        <>
            <BaseHeader />
            <div className="container my-4">
                <h2 className="mb-4">Mentoring Sessions</h2>

                {/* Search and Filter */}
                <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by title or mentor"
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="col-md-6">
                        <select className="form-select" onChange={handleFilterChange}>
                            <option value="all">All</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="canceled">Canceled</option>
                        </select>
                    </div>
                </div>

                {/* Schedule New Session Button */}
                <button className="btn btn-primary mb-4" onClick={() => setShowBookingModal(true)}>
                    Schedule New Session
                </button>

                {/* Render Sessions */}
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    filteredSessions.map((session) => (
                        <div key={session.id} className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{session.title}</h5>
                                <h5 className="card-title">{session.title}</h5>
                                    <p className="card-text">
                                        <strong>Mentor:</strong> {session.mentor?.full_name || "Unknown"} <br />
                                        <strong>Date:</strong> {session.date} <br />
                                        <strong>Time:</strong> {session.time} <br />
                                        <strong>Status:</strong> <span className="badge bg-success">{session.status}</span>
                                    </p>

                            </div>
                        </div>
                    ))
                )}

                {/* Booking Modal */}
                <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Schedule New Session</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Choose Mentor</Form.Label>
                                <Form.Select
                                    onChange={(e) =>
                                        setFormData({ ...formData, mentorId: e.target.value })
                                    }
                                >
                                    <option value="">Select</option>
                                    {mentors.map((mentor) => (
                                        <option key={mentor.id} value={mentor.id}>
                                            {mentor.full_name} - {mentor.expertise}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    onChange={(e) =>
                                        setFormData({ ...formData, date: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    onChange={(e) =>
                                        setFormData({ ...formData, time: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Goals (Optional)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter session goals"
                                    onChange={(e) =>
                                        setFormData({ ...formData, goals: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleBooking}>
                            Schedule
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            
            <BaseFooter />
        </>
    );
}

export default MentoringSessions;
