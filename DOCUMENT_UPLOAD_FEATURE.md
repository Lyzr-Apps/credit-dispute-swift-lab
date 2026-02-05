# Document Upload Feature - Implementation Summary

## Overview
Added comprehensive document upload functionality to the Credit Dispute Management System, allowing both customers and merchants to upload supporting files.

## Files Created/Modified

### 1. New Component: `/components/DocumentUpload.tsx`
- **Reusable document upload component** with drag & drop support
- Features:
  - Drag and drop file upload
  - Click to browse file selection
  - Multi-file support (configurable max files)
  - File type validation
  - Real-time upload progress
  - File preview with icons (PDF, images, Word docs)
  - File size display
  - Remove files before upload
  - Upload to Lyzr API via `/api/upload` endpoint
  - Display uploaded files with asset IDs
  - Inline status notifications (success/error/info)
  
- Props:
  - `onUploadComplete`: Callback with asset IDs and file details
  - `onFilesChange`: Callback when files are selected
  - `maxFiles`: Maximum number of files (default: 5)
  - `accept`: File types accepted (default: .pdf,.jpg,.jpeg,.png,.doc,.docx,.txt)
  - `label`: Upload section label
  - `className`: Optional styling

### 2. Modified: `/app/page.tsx`

#### Customer Portal Integration
- Added `uploadedDocumentIds` state to track uploaded documents
- Integrated `DocumentUpload` component in dispute summary sidebar
- Shows count of attached documents
- Notification on successful upload
- Documents can be uploaded after dispute details are gathered

**Location**: Dispute Summary sidebar (right panel) after customer narrative section

#### Merchant Dashboard Integration
- Added `uploadedEvidenceIds` state to track uploaded evidence
- Integrated `DocumentUpload` component in validation summary sidebar
- Available in two places:
  1. **Before validation starts**: Merchants can upload evidence immediately
  2. **After validation data received**: Additional evidence can be uploaded
- Shows count of attached evidence files
- Notification on successful upload
- Evidence IDs are cleared when validation is cancelled

**Location**: Validation Summary sidebar (right panel)

## Technical Details

### Upload Flow
1. User selects/drops files → Files added to `selectedFiles` state
2. User clicks "Upload" button → Files sent to `/api/upload`
3. API forwards files to Lyzr Upload API with API key
4. Lyzr returns asset IDs for each uploaded file
5. Component stores uploaded files and calls `onUploadComplete` callback
6. Parent component receives asset IDs for further processing

### API Integration
- Uses existing `/api/upload/route.ts` endpoint
- Uploads to Lyzr API: `https://agent-prod.studio.lyzr.ai/v3/assets/upload`
- Requires `LYZR_API_KEY` environment variable
- Returns structured response with asset IDs and file metadata

### Supported File Types
- PDF documents (.pdf)
- Images (.jpg, .jpeg, .png, .gif)
- Word documents (.doc, .docx)
- Text files (.txt)

### User Experience Features
- Drag and drop zone with visual feedback
- File icons based on file type
- File size display in human-readable format
- Individual file removal before upload
- Batch upload of multiple files
- Inline notifications (no toast/sonner as per requirements)
- Loading states during upload
- Success/error feedback

## Usage Examples

### Customer Portal
Customers can upload supporting documents for their dispute:
- Receipts
- Email confirmations
- Screenshots
- Communication logs
- Any relevant documentation

### Merchant Dashboard
Merchants can upload evidence to validate transactions:
- Delivery confirmations
- Customer signatures
- Authorization records
- Proof of service completion
- Transaction receipts
- Communication records

## No Icons Note
Uses lucide-react icons only (Upload, X, FileText, File, Loader2) - no emojis as per requirements.

## Integration with Agents
The uploaded asset IDs can be passed to AI agents for document analysis, though current implementation focuses on file storage and tracking. Future enhancements could include:
- Passing asset IDs to Knowledge Retrieval Agent
- Document analysis by Case Analysis Agent
- Evidence verification by Transaction Validation Agent

## Testing
To test the document upload feature:
1. Navigate to Customer Portal → Start Dispute → Provide dispute details
2. Scroll to "Supporting Documents" section in the sidebar
3. Drag files or click to browse
4. Upload files and verify asset IDs are displayed
5. Repeat for Merchant Dashboard → Validate Transaction

## Environment Requirements
- `LYZR_API_KEY` must be set in environment variables
- `/api/upload` endpoint must be accessible
- Internet connection for Lyzr API calls
