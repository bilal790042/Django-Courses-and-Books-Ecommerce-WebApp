import React, { useEffect, useState } from 'react'
import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'
import Rater from "react-rater"
import "react-rater/lib/react-rater.css"
import moment from "moment"

import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'
import useAxios from '../../utils/useAxios'
import UserData from '../plugin/UserData'
import { teacherId } from '../../utils/constants'
import toast from '../plugin/toast';

function Review() {
    const [reviews, setReview] = useState([]);
    const [reply, setReply] = useState("")
    const [filteredReviews, setFilterReview] = useState([]);



    const fetchReviewData = () => {
        // Check if teacherId is valid
        if (!teacherId || teacherId <= 0) {
            console.error("Invalid teacherId:", teacherId);

            return; // Exit the function if teacherId is invalid
        }

        useAxios()
            .get(`teacher/review-lists/${teacherId}/`)
            .then((res) => {
                console.log(res.data);
                setReview(res.data);
                setFilterReview(res.data)
            })
            .catch((error) => {
                console.error("Error fetching review data:", error);
            });
    };

    useEffect(() => {

        // console.log("Teacher ID:", teacherId); // Debugging

        fetchReviewData();
    }, []);

    const handleSubmitReply = (reviewId) => {
        useAxios().patch(`teacher/review-detail/${teacherId}/${reviewId}/`, { 
            reply: reply,
        }).then((res) => {
            console.log(res.data);
            fetchReviewData()
            toast().fire({
                icon: "success",
                title: "Reply sent"
            })
            setReply("")

        })
    };

    const handleSortByDate = (e) =>{
        const sortValue = e.target.value
        let sortedReview = [...filteredReviews]

        if(sortValue === "Newest"){
            sortedReview.sort((a,b) => new Date(b.date) - new Date(a.date))
        }else{
            sortedReview.sort((a,b) => new Date(a.date) - new Date(b.date))
        }

        setFilterReview(sortedReview);
    }

    const handleSortByRatingChange = (e) =>{
        const rating = parseInt(e.target.value)
        console.log(rating);
        if(rating === 0){
            fetchReviewData();
        }else{
            const filtered = reviews.filter((review) =>review.rating ===rating);
            setFilterReview(filtered)

        }   
        
    };

    const handleFilterByCourse = (e) =>{
        const query = e.target.value.toLowerCase();
        if(query ===""){
            fetchReviewData();
        }else{
            const filtered = reviews.filter((review) =>{
                return review.course.title.toLowerCase().includes(query);
            })
            setFilterReview(filtered);
        }

    }

    return (
        <>
            <BaseHeader />

            <section className="pt-5 pb-5">
                <div className="container">
                    {/* Header Here */}
                    <Header />
                    <div className="row mt-0 mt-md-4">
                        {/* Sidebar Here */}
                        <Sidebar />
                        <div className="col-lg-9 col-md-8 col-12">
                            {/* Card */}
                            <div className="card mb-4">
                                {/* Card header */}
                                <div className="card-header d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0">
                                        <h3 className="mb-0">Reviews</h3>
                                        <span>You have full control to manage your own account setting.</span>
                                    </div>
                                </div>
                                {/* Card body */}
                                <div className="card-body">
                                    {/* Form */}
                                    <form className="row mb-4 gx-2">
                                        <div className="col-xl-7 col-lg-6 col-md-4 col-12 mb-2 mb-lg-0">
                                        <input type="text" 
                                        className="form-control" 
                                        placeholder="Search By Course"
                                        onChange={handleFilterByCourse}
                                        />
                                        </div>
                                        <div className="col-xl-2 col-lg-2 col-md-4 col-12 mb-2 mb-lg-0">
                                            {/* Custom select */}
                                            <select className="form-select" onChange={handleSortByRatingChange}>
                                                <option value={0}>Rating</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={4}>4</option>
                                                <option value={5}>5</option>
                                            </select>
                                        </div>
                                        <div className="col-xl-3 col-lg-3 col-md-4 col-12 mb-2 mb-lg-0">
                                            {/* Custom select */}
                                            <select className="form-select" onChange={handleSortByDate}>
                                                <option value="">Sort by</option>
                                                <option value="Newest">Newest</option>
                                                <option value="Oldest">Oldest</option>
                                            </select>
                                        </div>
                                    </form>
                                    {/* List group */}
                                    <ul className="list-group list-group-flush">
                                        {/* List group item */}
                                        {filteredReviews?.map((r, index) => (


                                            <li className="list-group-item p-4 shadow rounded-3 mb-4">
                                                <div className="d-flex">
                                                    <img
                                                        src={r.profile?.image}
                                                        alt="avatar"
                                                        className="rounded-circle avatar-lg"
                                                        style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover" }}
                                                    />
                                                    <div className="ms-3 mt-2">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <h4 className="mb-0">{r.profile?.full_name}</h4>
                                                                <span>{moment(r.date).format("DD MMM, YYYY")}</span>
                                                            </div>
                                                            <div>
                                                                <a
                                                                    href="#"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Report Abuse"
                                                                >
                                                                    <i className="fe fe-flag" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <span className="fs-6 me-1 align-top">
                                                                <Rater
                                                                    total={5}
                                                                    rating={r.rating}
                                                                />
                                                            </span>
                                                            <span className="me-1">for</span>
                                                            <span className="h5">
                                                                {r.course?.title}
                                                            </span>
                                                            <p className="mt-2">
                                                                <span className='fw-bold me-2'>Review <i className='fas fa-arrow-right'></i></span>
                                                                {r.review}
                                                            </p>
                                                            <p className="mt-2">
                                                                <span className='fw-bold me-2'>Response <i className='fas fa-arrow-right'></i></span>
                                                                {r.reply || "No reply"}
                                                            </p>
                                                            <p>
                                                                <button class="btn btn-outline-secondary"
                                                                    type="button"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target={`#collapse${r.id}`}
                                                                    aria-expanded="false"
                                                                    aria-controls={`collapse${r.id}`}>
                                                                    Send Response
                                                                </button>
                                                            </p>
                                                            <div class="collapse" id={`collapse${r.id}`}>
                                                                <div class="card card-body">
                                                                    <div>
                                                                        <div class="mb-3">
                                                                            <label for="exampleInputEmail1" class="form-label">Write Response</label>
                                                                            <textarea
                                                                                name=""
                                                                                id="" cols="30"
                                                                                value={reply}
                                                                                className='form-control'
                                                                                rows="4"
                                                                                onChange={(e) => setReply(e.target.value)}
                                                                            ></textarea>
                                                                        </div>

                                                                        <button
                                                                            type="submit"
                                                                            class="btn btn-primary"
                                                                            onClick={() => handleSubmitReply(r.id)}
                                                                        >
                                                                            Send Response
                                                                            <i className='fas fa-paper-plane'> </i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                        {filteredReviews?.length<1 &&
                                        <p className="mt-4 p-3">No reviews</p>
                                        }

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    )
}

export default Review
