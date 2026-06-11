// /* eslint-disable */
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Container, Typography, Grid, Box, Divider } from "@mui/material";
// import { Skeleton, Paper } from "@mui/material";

// export default function FAQSView({ userId }) {
//   const [user, setUser] = useState(null);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_API_BASEURL}/cms/faqs/${userId}`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//       })
//       .then((res) => {
//         if (res.data.status === 1) {
//           setUser(res.data.data);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching user:", err);
//       });
//   }, [userId, token]);

//   if (!user) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Paper sx={{ p: 3 }}>
//           {/* Question */}
//           <Skeleton animation="wave" variant="text" width={100} height={20} />
//           <Skeleton
//             animation="wave"
//             variant="text"
//             height={30}
//             sx={{ mb: 2 }}
//           />

//           <Divider sx={{ my: 2 }} />

//           {/* Answer */}
//           <Skeleton animation="wave" variant="text" width={100} height={20} />
//           <Skeleton
//             animation="wave"
//             variant="rectangular"
//             height={120}
//             sx={{ borderRadius: 1 }}
//           />
//         </Paper>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Grid>
//         <Grid item xs={12} md={6}>
//           {/* Question */}
//           <Box mb={2}>
//             <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//               Question
//             </Typography>

//             <Typography
//               variant="body1"
//               fontWeight={600}
//               sx={{ lineHeight: 1.6 }}
//             >
//               {user.question || "N/A"}
//             </Typography>
//           </Box>

//           <Divider sx={{ my: 2 }} />

//           {/* Answer */}
//           <Box>
//             <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//               Answer
//             </Typography>

//             <Typography
//               variant="body2"
//               sx={{
//                 textAlign: "justify",
//                 lineHeight: 1.8,
//                 wordBreak: "break-word",
//               }}
//             >
//               {user.answer || "N/A"}
//             </Typography>
//           </Box>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// }
