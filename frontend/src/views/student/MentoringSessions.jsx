import React, { useState, useEffect } from "react";
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
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [formData, setFormData] = useState({
        mentorId: "",
        date: "",
        time: "",
        goals: "",
    });

    useEffect(() => {
        // Simulated API calls to fetch sessions and mentors
        const fetchSessions = async () => {
            setLoading(true);
            const mockSessions = [
                {
                    id: 1,
                    title: "JavaScript Basics",
                    mentor: "John Doe",
                    mentorId: "1",
                    date: "2024-12-25",
                    time: "10:00 AM",
                    status: "upcoming",
                    joinLink: "#",
                    resources: ["https://example.com/resource1"],
                    feedback: { rating: 4, comments: "Great session!" },
                },
                {
                    id: 2,
                    title: "React Advanced",
                    mentor: "Jane Smith",
                    mentorId: "2",
                    date: "2024-12-10",
                    time: "2:00 PM",
                    status: "completed",
                    feedback: { rating: 5, comments: "Very insightful!" },
                },
            ];
            const mockMentors = [
                { id: "1", name: "John Doe", expertise: "JavaScript, HTML, CSS" },
                { id: "2", name: "Jane Smith", expertise: "React, Redux, UI/UX" },
            ];
            setTimeout(() => {
                setSessions(mockSessions);
                setMentors(mockMentors);
                setLoading(false);
            }, 1000);
        };

        fetchSessions();
    }, []);

    useEffect(() => {
        const filtered = sessions.filter((session) => {
            const matchesSearch =
                session.title.toLowerCase().includes(searchQuery) ||
                session.mentor.toLowerCase().includes(searchQuery);
            const matchesFilter =
                filterStatus === "all" || session.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
        setFilteredSessions(filtered);
    }, [sessions, searchQuery, filterStatus]);

    const handleBooking = () => {
        alert("Session booked successfully!");
        setShowBookingModal(false);
    };

    const handleCancel = (id) => {
        alert(`Session with ID ${id} canceled!`);
        setSessions((prev) =>
            prev.map((session) =>
                session.id === id ? { ...session, status: "canceled" } : session
            )
        );
    };

    const handleReschedule = () => {
        alert("Session rescheduled successfully!");
        setShowDetailsModal(false);
    };

    const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());
    const handleFilterChange = (e) => setFilterStatus(e.target.value);

    const renderSessions = () =>
        filteredSessions.map((session) => (
            <div key={session.id} className="card mb-3 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">{session.title}</h5>
                    <p className="card-text">
                        <strong>Mentor:</strong> {session.mentor} <br />
                        <strong>Date:</strong> {session.date} <br />
                        <strong>Time:</strong> {session.time} <br />
                        <strong>Status:</strong>{" "}
                        <span
                            className={`badge ${session.status === "upcoming"
                                    ? "bg-success"
                                    : session.status === "completed"
                                        ? "bg-secondary"
                                        : "bg-danger"
                                }`}
                        >
                            {session.status}
                        </span>
                    </p>
                    {session.status === "upcoming" && (
                        <div>
                            <a
                                href={session.joinLink}
                                className="btn btn-primary btn-sm me-2"
                            >
                                Join Session
                            </a>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleCancel(session.id)}
                            >
                                Cancel Session
                            </button>
                        </div>
                    )}
                    {session.status === "completed" && session.feedback && (
                        <div>
                            <p>
                                <strong>Feedback:</strong>{" "}
                                {session.feedback.comments} (Rating:{" "}
                                {session.feedback.rating}/5)
                            </p>
                        </div>
                    )}
                </div>
            </div>
        ));

    return (
        <>
            <BaseHeader />
            <div className="container my-4">
                <h2 className="mb-4">Mentoring Sessions</h2>

                {/* Search and Filter */}
                <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by title or mentor"
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="col-md-6">
                        <select
                            className="form-select"
                            onChange={handleFilterChange}
                        >
                            <option value="all">All</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="canceled">Canceled</option>
                        </select>
                    </div>
                </div>

                {/* Booking Button */}
                <button
                    className="btn btn-primary mb-4"
                    onClick={() => setShowBookingModal(true)}
                >
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
                    renderSessions()
                )}

                {/* Booking Modal */}
                <Modal
                    show={showBookingModal}
                    onHide={() => setShowBookingModal(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Schedule New Session</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Choose Mentor</Form.Label>
                                <Form.Select
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            mentorId: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Select</option>
                                    {mentors.map((mentor) => (
                                        <option key={mentor.id} value={mentor.id}>
                                            {mentor.name} - {mentor.expertise}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            date: e.target.value,
                                        })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            time: e.target.value,
                                        })
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
                                        setFormData({
                                            ...formData,
                                            goals: e.target.value,
                                        })
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
