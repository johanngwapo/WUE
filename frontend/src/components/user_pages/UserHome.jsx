import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CardMedia, Grid, Modal, Button } from "@mui/material";
import { Link } from "react-router-dom";
import UserSidebar from "./UserSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import EventService from "../../services/EventService.jsx";
import { format, isToday } from 'date-fns';
import { ArrowForward, InfoOutlined } from "@mui/icons-material";
import "../styles/FontStyle.css";

import { useNavigate } from "react-router-dom";
import { getAuth } from "../../utils/AuthContext.jsx";

function UserHome() {
    const nav = useNavigate();
    const { currentUser, toggleOrganizer } = getAuth();

    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [showPolicyModal, setShowPolicyModal] = useState(false);

    useEffect(() => {
        if(currentUser){
            if(currentUser.accountType === "organizer"){
                if(toggleOrganizer) {
                    nav('/organizer/dashboard');
                }
            }
            else if(currentUser.accountType === "admin"){
                nav("/admin/dashboard");
            } else {
                // Check if user has seen the cancellation policy announcement
                const hasSeenPolicy = sessionStorage.getItem(`policyAcknowledged_${currentUser.userId}`);
                if (!hasSeenPolicy) {
                    setShowPolicyModal(true);
                }
            }
        }
    }, [currentUser, toggleOrganizer, nav]);

    const handlePolicyAcknowledge = () => {
        if (currentUser) {
            sessionStorage.setItem(`policyAcknowledged_${currentUser.userId}`, 'true');
        }
        setShowPolicyModal(false);
    };

    useEffect(() => {
        const fetchFeaturedEvents = async () => {
            try {
                const response = await EventService.getFeaturedEvents();
                const eventsWithPhotos = await Promise.all(response.data.slice(0, 2).map(async (event) => {
                    if (event.coverPhoto) {
                        const coverPhotoResponse = await EventService.getCoverPhoto(event.coverPhoto);
                        event.coverPhotoUrl = URL.createObjectURL(coverPhotoResponse.data);
                    }
                    return event;
                }));
                setFeaturedEvents(eventsWithPhotos);
            } catch (error) {
                console.error("Error fetching featured events:", error);
            }
        };

        const fetchUpcomingEvents = async () => {
            try {
                const response = await EventService.getRandomUpcomingEvents();
                const eventsWithPhotos = await Promise.all(response.data.slice(0, 3).map(async (event) => {
                    if (event.coverPhoto) {
                        const coverPhotoResponse = await EventService.getCoverPhoto(event.coverPhoto);
                        event.coverPhotoUrl = URL.createObjectURL(coverPhotoResponse.data);
                    }
                    return event;
                }));
                setUpcomingEvents(eventsWithPhotos);
            } catch (error) {
                console.error("Error fetching upcoming events:", error);
            }
        };

        fetchFeaturedEvents();
        fetchUpcomingEvents();
    }, []);

    return (
        <div className="home">
            <Box sx={{ display: "flex" }}>
                <UserSidebar />
                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
                    <CustomAppBar title={"Home"} />
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Grid container spacing={2} sx={{ height: "100%" }}>
                            <Grid item xs={12}>
                                <Box sx={{ height: "100%" }}>
                                    <Typography variant="h5">Featured Events</Typography>
                                    <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap", paddingTop: "10px" }}>
                                        {featuredEvents.length > 0 ? (
                                            featuredEvents.map(event => (
                                                <Card key={event.eventId} sx={{ display: 'flex', flex: "1 1 calc(33.333% - 16px)", height: 250, '@media (max-width: 1200px)': { flexDirection: 'column', height: 'auto' } }}>
                                                    <CardMedia
                                                        component="img"
                                                        sx={{ width: "50%", '@media (max-width: 1280px)': { width: "100%" } }}
                                                        image={event.coverPhotoUrl || "/assets/placeholders/1280x720-image-placeholder.png"}
                                                        alt="Event"
                                                    />
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                                        <CardContent sx={{ flex: '1 0 auto' }}>
                                                            <Typography
                                                                component="span"
                                                                sx={{ paddingBottom: "5px", textTransform: "uppercase", color: "text.secondary", fontSize: "12px", whiteSpace: "normal" }}
                                                            >
                                                                {isToday(new Date(event.startDatetime))
                                                                    ? `Today | ${format(new Date(event.startDatetime), 'p')}`
                                                                    : `${format(new Date(event.startDatetime), 'EEE, MMM d | p')}`}
                                                            </Typography>
                                                            <Typography
                                                                component="div"
                                                                variant="h6"
                                                                sx={{ fontWeight: "bold", whiteSpace: "normal" }}
                                                            >
                                                                {event.name}
                                                            </Typography>
                                                            <Typography
                                                                component="div"
                                                                variant="body2"
                                                                sx={{ paddingBottom: "15px", fontSize: "14px", whiteSpace: "normal" }}
                                                            >
                                                                {event.venue?.name || "Unknown Venue"}
                                                            </Typography>
                                                            <Typography
                                                                component="div"
                                                                variant="body2"
                                                                sx={{ fontSize: "12px", whiteSpace: "normal" }}
                                                            >
                                                                {event.description}
                                                            </Typography>
                                                        </CardContent>
                                                        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", flexGrow: 1, padding: 2 }}>
                                                            <Typography variant="body2" sx={{ cursor: "pointer", color: "gray" }}>
                                                                <Link to={`/events/view/${event.eventId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                    More Details
                                                                </Link>
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            ))
                                        ) : (
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Typography variant="h5" sx={{ color: "gray" }}>No events listed...</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ height: "100%" }}>
                                    <Box sx={{ marginTop: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography variant="h5">Upcoming Events</Typography>
                                        <Typography variant="body2" sx={{ cursor: "pointer", color: "black", display: "flex", alignItems: "center" }}>
                                            <Link to="/events" style={{ textDecoration: 'none', color: 'inherit', display: "flex", alignItems: "center" }}>
                                                <Typography sx={{ marginRight: "10px" }} >Explore more events</Typography> <ArrowForward />
                                            </Link>
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap", paddingTop: "10px", height: "75%" }}>
                                        {upcomingEvents.length > 0 ? (
                                            upcomingEvents.map(event => (
                                                <Card key={event.eventId} sx={{ flex: "1 1 calc(33.333% - 16px)", display: "flex", flexDirection: "column", height: "auto", '@media (max-width: 1200px)': { flexDirection: 'column', height: 'auto' } }}>
                                                    <CardMedia
                                                        component="img"
                                                        sx={{ width: "100%", height: "60%", '@media (max-width: 1200px)': { width: "100%" } }}
                                                        image={event.coverPhotoUrl || "/assets/placeholders/1280x720-image-placeholder.png"}
                                                        alt="Event"
                                                    />
                                                    <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                                                        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                                            <Typography
                                                                sx={{ paddingBottom: "5px", textTransform: "uppercase", color: "text.secondary", fontSize: "12px", whiteSpace: "normal" }}
                                                            >
                                                                {isToday(new Date(event.startDatetime))
                                                                    ? `Today | ${format(new Date(event.startDatetime), 'p')}`
                                                                    : `${format(new Date(event.startDatetime), 'EEE, MMM d | p')}`}
                                                            </Typography>
                                                            <Typography variant="h6" sx={{ fontWeight: "bold", whiteSpace: "normal" }}>
                                                                {event.name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontSize: "12px", whiteSpace: "normal" }}>
                                                                {event.description}
                                                            </Typography>

                                                            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", flexGrow: 1 }}>
                                                                <Typography variant="body2" sx={{ cursor: "pointer", color: "gray" }}>
                                                                    <Link to={`/events/view/${event.eventId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                        More Details
                                                                    </Link>
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        ) : (
                                            <Box sx={{ display: "flex" }}>
                                                <Typography variant="h5" sx={{ color: "gray" }}>No events listed...</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>

            {/* Cancellation Policy Announcement Modal */}
            <Modal
                open={showPolicyModal}
                onClose={() => {}} // Prevent closing by clicking backdrop
                aria-labelledby="policy-modal-title"
                aria-describedby="policy-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: '500px' },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 2,
                    p: 4,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <InfoOutlined sx={{ fontSize: 32, color: '#1976d2', mr: 2 }} />
                        <Typography id="policy-modal-title" variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                            New Cancellation Policy
                        </Typography>
                    </Box>
                    
                    <Typography id="policy-modal-description" sx={{ mb: 3, color: 'text.secondary' }}>
                        Please take note of our updated event cancellation policy:
                    </Typography>

                    <Box sx={{ 
                        bgcolor: '#f5f5f5', 
                        p: 2.5, 
                        borderRadius: 1, 
                        mb: 3,
                        border: '1px solid #e0e0e0'
                    }}>
                        <Box sx={{ display: 'flex', mb: 2 }}>
                            <Typography sx={{ mr: 1, color: '#1976d2', fontWeight: 'bold' }}>•</Typography>
                            <Typography sx={{ fontSize: '15px', lineHeight: 1.6 }}>
                                <strong>Free cancellation</strong> allowed up to <strong>72 hours</strong> before the event.
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            <Typography sx={{ mr: 1, color: '#1976d2', fontWeight: 'bold' }}>•</Typography>
                            <Typography sx={{ fontSize: '15px', lineHeight: 1.6 }}>
                                <strong>Cancellation within 48 hours</strong> only permitted for emergencies with valid documentation (e.g., medical certificate, family emergency).
                            </Typography>
                        </Box>
                    </Box>

                    <Typography sx={{ mb: 3, fontSize: '14px', color: 'text.secondary', fontStyle: 'italic' }}>
                        This policy helps ensure fair access to events for all students and reduces last-minute cancellations.
                    </Typography>

                    <Button 
                        variant="contained" 
                        fullWidth 
                        onClick={handlePolicyAcknowledge}
                        sx={{ 
                            py: 1.5,
                            fontSize: '16px',
                            fontWeight: 'bold',
                            textTransform: 'none'
                        }}
                    >
                        I Understand
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default UserHome;