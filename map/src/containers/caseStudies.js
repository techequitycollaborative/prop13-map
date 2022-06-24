import React from 'react'
import "../styles/main.css"
import "../styles/caseStudies.css"
import CaseStudyDesign1 from "../components/CaseStudyDesign1";


const initialProperties = [
    {
        city1: "Santa Clarita",
        address1: "21070 Centre Point Parkway",
        address1line2: "Santa Clarita CA 91350",
        landvalue1: 1.60,
        sqft1: 6664,
        photo1: "https://images1.loopnet.com/i2/zg5NPRe5Ws9ia3I-ldrmJyhR36o3QFvjYT5VIJzxf6w/112/image.jpg",
        city2: "Santa Clarita",
        address2: "26415 Summit Circle",
        address2line2: "Santa Clarita CA 91350",
        landvalue2: 140,
        sqft2: 7863,
        photo2: "https://images1.loopnet.com/i2/isy0EBCPWTwEHbih2zzgbauKXR_5Kg5j4jC7064O5-E/110/image.jpg",
        id: 1,
    },
    {
        city1: "INGLEWOOD",
        address1: "808 E MANCHESTER BLVD ",
        address1line2: "INGLEWOOD CA 90301",
        landvalue1: 2.65,
        sqft1: 5858,
        photo1: "https://images1.loopnet.com/i2/DNlvKtX7PIRu0mGhHtaKBRdKWWmLZZ2RQoIHXOv9slM/112/image.jpg",
        city2: "INGLEWOOD",
        address2: "1091 LA BREA DR",
        address2line2: "INGLEWOOD CA 90301",
        landvalue2: 101,
        sqft2: 5334,
        photo2: "https://images1.loopnet.com/i2/vK1qAe_AutRnQz97e3BCS4FT8wubeRTL84IIkAmy87s/112/image.jpg",
        id: 2,
    },
    {
        city1: "SANTA CLARITA",
        address1: "22750 SOLEDAD CANYON RD ",
        address1line2: "SANTA CLARITA CA 91350",
        landvalue1: 2.80,
        sqft1: 12320,
        photo1: "https://images1.loopnet.com/i2/RQYQ7SzESOShg6Vbqr5Nl8L4nyNVwBP-jX9O8P8URx0/112/image.jpg",
        city2: "SANTA CLARITA",
        address2: "23500 VALENCIA BLVD",
        address2line2: "SANTA CLARITA CA 91355",
        landvalue2: 217,
        sqft2: 11043,
        photo2: "https://images1.loopnet.com/i2/xlZzWi56RtfM-yRbdEz-NvzDZnK5qt7UxYNIym4K_SQ/112/23500-Valencia-Blvd-Valencia-CA-1-HighDefinition.jpg",
        id: 3,
    },
];

const CaseStudies = () => {
    return (
        <div className="case-study-page">
            <h1 className="center">CASE STUDIES</h1>
            {initialProperties.map(p => <CaseStudyDesign1 properties={p} key={p.id}/>)}
        </div>
    )}

export default CaseStudies;
