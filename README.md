# ChatterBox Development Roadmap
A social networking platform that connects people with friends, family, and communities. Enables users to create profiles, share updates, photos, and videos, and interact through comments, likes, and messaging.

## 1. Core Tech Stack
- **Frontend:** Angular  
- **Backend:** Node.js with Express.js  
- **Database:** MySQL  
- **Hosting:** Start with **Heroku** or **Render** (for free tiers); scale to **AWS** or **DigitalOcean** later  

## 2. Key Features and Modules
### Essential Features:
- **User Profiles:**  
  - Profile photo, bio, and cover photo  
  - User activity log (posts, comments, friends)  

- **Timeline and Posts:**  
  - Text posts, images, videos  
  - Likes, comments, and replies (with nested replies)  

- **Messaging System:**  
  - Real-time direct messages  
  - Read receipts and typing indicators  

- **Friend Requests and Communities:**  
  - Friend request acceptance/rejection  
  - Group communities for shared interests  

- **Admin Tools:**  
  - Admin account with dashboard to manage reported posts  
  - Option to delete posts, comments, or users directly  

- **Authentication:**  
  - Username/email login  
  - Google/Apple social login integration  
  - Optional 2FA using phone/email OTP  

- **Notifications:**  
  - Real-time notifications using **WebSockets** (via **Socket.IO**)  
  - Email notifications for friend requests, messages, and community invites  

## 3. Backend Architecture
- **API Structure:**  
  - RESTful APIs for frontend-backend communication  
  - **Socket.IO** for handling messaging and notifications  

- **Database Schema (MySQL):**  
  - Users table (profile and auth data)  
  - Posts, Comments, and Replies tables (for the timeline)  
  - Friend Requests table  
  - Admin Reports table (for flagged content tracking)  

- **Security:**  
  - Password hashing with **bcrypt**  
  - **JWT** for user authentication  
  - **OAuth2** for Google/Apple logins  
  - Encryption with **HTTPS** and 2FA integration  

## 4. Frontend Architecture
- **UI Libraries & Frameworks:**  
  - Use **Angular Material** for pre-built components with a clean design  
  - Custom CSS for Apple/Uber-inspired minimal UI  

- **UI Components:**  
  - Login & Registration Forms  
  - Profile Page  
  - Timeline Feed with Infinite Scroll  
  - Real-time Chat Interface  
  - Admin Dashboard  

- **Routing:**  
  - Angular Router for managing routes (e.g., `/login`, `/profile`, `/community`)  

## 5. Development Phases
| Phase            | Features                                  | Estimated Time |
|------------------|--------------------------------------------|----------------|
| **Phase 1**      | Set up backend, database, and API routes  | 1-2 weeks      |
| **Phase 2**      | Implement frontend (basic UI)             | 2-3 weeks      |
| **Phase 3**      | Add timeline posts, likes, comments       | 1-2 weeks      |
| **Phase 4**      | Develop messaging with WebSockets         | 2-3 weeks      |
| **Phase 5**      | Admin tools and reports system            | 1-2 weeks      |
| **Phase 6**      | Finalize with authentication & 2FA        | 1-2 weeks      |
| **Phase 7**      | Testing and bug fixes                     | 1-2 weeks      |

## 6. Hosting Strategy
1. **Development Phase:**  
   - Use **Heroku** or **Render** for quick deployment and free hosting  
2. **Production Phase:**  
   - Scale to **AWS Lightsail** or **DigitalOcean**  

## 7. Testing & Deployment
- **Testing:**  
  - Unit testing with **Jest** (backend) and **Karma/Jasmine** (Angular)  
  - Integration testing for API endpoints  

- **Deployment:**  
  - Continuous Deployment using **GitHub Actions**  

## 8. Budget Considerations
- **Starting Costs:**  
  - Hosting (Heroku/Render free tiers)  
  - Database: Free tier on MySQL hosting platforms like **PlanetScale**  
  - Google and Apple OAuth: Free with developer registration  

- **Scaling Costs:**  
  - Upgrade to paid tiers as needed (e.g., AWS, DigitalOcean)  
  - Optional: Use **Stripe** for future monetization with subscriptions  
