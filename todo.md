# Medicine Access Platform - Project TODO

## Phase 1: Design System & Setup
- [x] Configure Scandinavian design system in index.css (pale cool gray, soft pastels)
- [x] Set up typography with bold black sans-serif and thin subtitles
- [x] Create reusable component library for geometric accent shapes
- [x] Set up global color variables and spacing system

## Phase 2: Landing Page
- [x] Create landing page layout with hero section
- [x] Implement CTA button ("Start Medicine Search")
- [x] Build feature highlights section (3-4 key benefits)
- [x] Build how-it-works section with step-by-step flow
- [x] Add responsive navigation header
- [x] Implement footer with links and info

## Phase 3: Medicine Search & Analysis
- [x] Create medicine search page layout
- [ ] Build search input component with autocomplete
- [x] Implement LLM-powered medicine analysis (active ingredients, therapeutic category, dosage form)
- [x] Create medicine analysis display component
- [x] Add regulatory approval status display
- [x] Build search results page component

## Phase 4: Alternatives Finder & Price Comparison
- [ ] Implement AI-powered alternatives finder (generic + lower-cost branded)
- [ ] Create alternatives list component with equivalence indicators
- [ ] Build side-by-side price comparison table
- [ ] Add affordability insights and savings highlights
- [ ] Implement dosage compatibility verification display
- [ ] Add active ingredient equivalence badges

## Phase 5: Pharmacy Locator & Prescription Upload
- [ ] Integrate Google Maps for pharmacy locator
- [ ] Build pharmacy availability display on map
- [ ] Create prescription upload component (image/PDF)
- [ ] Implement LLM vision-based prescription parsing
- [ ] Add file upload to cloud storage (S3)
- [ ] Build prescription parsing results display

## Phase 6: User Features
- [ ] Create user authentication flow (already built in template)
- [ ] Implement search history tracking for authenticated users
- [ ] Build saved medicines list feature
- [ ] Create medicine detail page with full drug profile
- [ ] Add brand vs. generic breakdown display
- [ ] Implement available formulations display
- [ ] Build regulatory body approval details section
- [ ] Add user dashboard to view history and saved medicines

## Phase 7: External API Integration
- [ ] Research and integrate medicine pricing APIs
- [ ] Implement pharmacy stock availability API calls
- [ ] Build real-time price comparison data fetching
- [ ] Add pharmacy location data fetching
- [ ] Implement error handling for API failures
- [ ] Add data caching for performance

## Phase 8: Polish & Testing
- [x] Write and run unit tests for medicines router (search, analyze, save)
- [ ] Test medicine search flow end-to-end
- [ ] Test alternatives finder accuracy
- [ ] Test prescription upload and parsing
- [ ] Test pharmacy locator map functionality
- [ ] Test user authentication and saved features
- [ ] Verify responsive design across devices
- [ ] Test error states and edge cases
- [ ] Optimize performance and load times
- [ ] Final design review and polish

## Database Schema
- [x] Users table (already exists)
- [x] Medicines table (name, active ingredients, therapeutic category, dosage form)
- [x] Alternatives table (original medicine, alternative medicine, equivalence score)
- [x] Prices table (medicine, brand, price, pharmacy, timestamp)
- [x] Pharmacies table (name, location, coordinates)
- [x] User search history table
- [x] User saved medicines table
- [x] Prescriptions table (user, upload URL, parsed medicines, timestamp)

## LLM Integration Points
- [x] Medicine name analysis (extract active ingredients, therapeutic purpose)
- [ ] Prescription image/PDF parsing (extract medicine names and dosages)
- [ ] Alternatives generation (find generic and lower-cost alternatives)
- [ ] Safety assessment (verify substitution safety)

## API Integration Points
- [ ] Medicine pricing API
- [ ] Pharmacy availability API
- [ ] Pharmacy location/geocoding API
- [ ] Regulatory approval database API (optional)

## Design Assets
- [ ] Geometric accent shapes (SVG components)
- [ ] Icons for features and UI elements
- [ ] Color palette implementation
- [ ] Typography system
