import React from 'react'
import "../styles/main.css"
import "../styles/about.css"

const About = () => {
    return (
        <div className="about">
            <h1 className="center">ABOUT</h1>
            <div className="card">
            <p class="answer">This website is part of a project by HMC TechEquity Collaboartive Clinic 21' Team.</p>
            <p>
                <li><a href="https://github.com/annadsinger0" class="answer" target='_blank' rel="noreferrer">Anna Singer</a></li>
                <li><a href="https://github.com/arunramakrishna" class="answer" target='_blank' rel="noreferrer">Arun Ramakrishna</a></li>
                <li><a href="https://github.com/mariesateo" class="answer" target='_blank' rel="noreferrer">Mariesa Teo</a></li>
                <li><a href="https://github.com/kripeshr22" class="answer" target='_blank' rel="noreferrer">Kripesh Ranabhat</a></li>
                <li><a href="https://github.com/yurynamgung" class="answer" target='_blank' rel="noreferrer">Yury Namgung</a></li></p>
            <br/>
            <a href="https://github.com/kripeshr22/MappingDemo" className={'link'} target='_blank' rel="noreferrer">GITHUB</a>
            </div>
        </div>
    )}

export default About;