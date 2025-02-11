import React, { useState,useEffect } from "react";
import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'
import toast from "../plugin/toast";
import { useNavigate } from "react-router-dom";

const CourseCreationForm = ({ userToken, courseId }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isApproved, setIsApproved] = useState(null);
    const [feedback, setFeedback] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        learningObjectives: ["", "", "", ""],
        prerequisites: [""],
        intendedLearners: [""],
        timeCommitment: "",
    });
    useEffect(() => {
        checkApprovalStatus(); // Check approval status when component loads
    }, []);

    const checkApprovalStatus = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/learning-modules/${courseId}/`, {
                method: "GET",
                headers: { Authorization: `Bearer ${userToken}` }
            });

            if (!response.ok) throw new Error("Failed to fetch course status");

            const data = await response.json();
            setIsApproved(data.is_approved);
            setFeedback(data.feedback);

            if (data.is_approved) {
                toast().fire({ icon: "success", title: "✅ Your course has been approved!" });
                navigate("/instructor/dashboard/");
            }
        } catch (error) {
            console.error("Error checking approval status:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (e, index, field) => {
        const updatedArray = [...formData[field]];
        updatedArray[index] = e.target.value;
        setFormData({ ...formData, [field]: updatedArray });
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if required fields are empty
        if (!formData.title || !formData.category || !formData.timeCommitment) {
            toast().fire({
                icon: "error",
                title: "Please fill in all required fields before submitting."
            })


            return;
        }

        const formdata = new FormData();
        formdata.append("title", formData.title);
        formdata.append("category", formData.category);
        formdata.append("time_commitment", formData.timeCommitment);
        formdata.append("learning_objectives", JSON.stringify(formData.learningObjectives));
        formdata.append("intended_learners", JSON.stringify(formData.intendedLearners));
        formdata.append("prerequisites", JSON.stringify(formData.prerequisites));

        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/learning-modules/", {
                method: "POST",
                body: formdata,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            toast().fire({
                icon: "success",
                title: "Your request has been submitted. Please wait for admin approval"
            })
            navigate("/instructor/dashboard/");


        } catch (error) {
            console.error("Error submitting form:", error);
            alert(`Failed to submit the course. ${error.message}`);
        }
    };










    return (
        <>
            <BaseHeader />
            <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100">
                <div className="card p-5 shadow-lg w-75 h-75">
                    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100">
                        <div className="card p-5 shadow-lg w-75 h-75">
                            {isApproved === false ? (
                                <h2 className="text-warning text-center">⏳ Your course is still under review.</h2>
                            ) : isSubmitted ? (
                                <h2 className="text-success text-center">✅ Your course has been submitted for review!</h2>
                            ) : (
                                <>
                                    {step === 1 && (
                                        <>
                                            <h2 className="text-primary text-center">How about a working title?</h2>
                                            <p className="text-center">It's ok if you can't think of a good title now. You can change it later.</p>
                                            <input
                                                type="text"
                                                name="title"
                                                className="form-control"
                                                placeholder="Enter Course Title"
                                                required
                                                value={formData.title}
                                                onChange={handleChange}


                                            />
                                            <div className="d-flex justify-content-end mt-3">
                                                <button className="btn btn-primary" onClick={nextStep}>Continue</button>
                                            </div>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <>
                                            <h2 className="text-primary text-center">What category best fits your knowledge?</h2>
                                            <p className="text-center">If you're not sure, you can change it later.</p>
                                            <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
                                                <option value="">Select Category</option>
                                                <option>Web Development</option>
                                                <option>Data Science</option>
                                                <option>Business</option>
                                                <option>Design</option>
                                                <option>Marketing</option>
                                                <option>Health & Fitness</option>
                                                <option>Photography</option>
                                                <option>Music</option>


                                            </select>
                                            <div className="d-flex justify-content-between mt-3">
                                                <button className="btn btn-primary" onClick={prevStep}>Previous</button>
                                                <button className="btn btn-primary" onClick={nextStep}>Continue</button>
                                            </div>
                                        </>
                                    )}

                                    {step === 3 && (
                                        <>
                                            <h2 className="text-primary text-center">Intended Learners</h2>
                                            <p className="text-center">Describe who will benefit from your course.</p>
                                            {formData.intendedLearners.map((learner, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    className="form-control mb-2"
                                                    required
                                                    value={learner}  // Instead of value={learner.intendedLearners}



                                                    placeholder={`Learner ${index + 1}`}
                                                    onChange={(e) => handleArrayChange(e, index, "intendedLearners")}
                                                />
                                            ))}
                                            <div className="d-flex justify-content-between mt-3">
                                                <button className="btn btn-primary" onClick={prevStep}>Previous</button>
                                                <button className="btn btn-primary" onClick={nextStep}>Continue</button>
                                            </div>
                                        </>
                                    )}

                                    {step === 4 && (
                                        <>
                                            <h2 className="text-primary text-center">What will students learn in your course?</h2>
                                            <p className="text-center">Enter at least 4 learning objectives.</p>
                                            {formData.learningObjectives.map((objective, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    className="form-control mb-2"
                                                    required
                                                    value={objective.learningObjectives}
                                                    placeholder={`Objective ${index + 1}`}
                                                    onChange={(e) => handleArrayChange(e, index, "learningObjectives")}
                                                />
                                            ))}
                                            <div className="d-flex justify-content-between mt-3">
                                                <button className="btn btn-primary" onClick={prevStep}>Previous</button>
                                                <button className="btn btn-primary" onClick={nextStep}>Continue</button>
                                            </div>
                                        </>
                                    )}

                                    {step === 5 && (
                                        <>
                                            <h2 className="text-primary text-center">What are the prerequisites for your course?</h2>
                                            <p className="text-center">List any necessary knowledge or tools.</p>
                                            {formData.prerequisites.map((prereq, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    className="form-control mb-2"
                                                    required
                                                    value={prereq.prerequisites}

                                                    placeholder={`Requirement ${index + 1}`}
                                                    onChange={(e) => handleArrayChange(e, index, "prerequisites")}
                                                />
                                            ))}
                                            <div className="d-flex justify-content-between mt-3">
                                                <button className="btn btn-primary" onClick={prevStep}>Previous</button>
                                                <button className="btn btn-primary" onClick={nextStep}>Continue</button>
                                            </div>
                                        </>
                                    )}

                                    {step === 6 && (
                                        <>
                                            <h2 className="text-primary text-center">How much time can you spend per week?</h2>
                                            <p className="text-center">Choose an option.</p>
                                            <select name="timeCommitment" className="form-control" onChange={handleChange}>
                                                <option value="">Select Time Commitment</option>
                                                <option>0-2 hours</option>
                                                <option>2-4 hours</option>
                                                <option>5+ hours</option>
                                                <option>Not sure yet</option>

                                            </select>
                                            <div className="d-flex justify-content-between mt-3">
                                                <button className="btn btn-primary" onClick={prevStep}>Previous</button>
                                                <button className="btn btn-primary" onClick={nextStep}>Continue</button>
                                            </div>
                                        </>
                                    )}

                                    {step === 7 && (
                                        <>
                                            <h2 className="text-primary text-center">Submit for Review</h2>
                                            <p className="text-center">Click below to submit your course for review.</p>
                                            <div className="d-flex justify-content-between mt-3">
                                                <button className="btn btn-primary" onClick={prevStep}>Previous</button>
                                                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit for Review</button>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <BaseFooter />
        </>
    );
};

export default CourseCreationForm;
