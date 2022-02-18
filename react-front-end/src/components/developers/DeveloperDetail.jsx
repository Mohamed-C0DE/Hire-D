import axios from "axios";
import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import ProjectListItem from "../projects/ProjectListItem";
import Certification from "../certifications/Certification";
import { useParams } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import "./DeveloperDetail.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import Button from "@mui/material/Button";

const DeveloperDetail = () => {
  const [state, setState] = useState({
    user: {},
    projects: [],
    certifications: [],
  });

  let url_id = useParams();

  const getUsers = axios.get("/api/users");
  const getProjects = axios.get("/api/projects");
  const getCertifications = axios.get("/api/certifications");

  const userDetails = (users, id) => {
    const singleUser = users.filter((user) => user.id === id);

    return singleUser[0];
  };

  const getProjectsByUser = (projects, id) => {
    const projectByUser = projects.filter((project) => project.owner_id === id);

    return projectByUser;
  };

  const getCertificationsByUser = (certifications, id) => {
    const certificates = certifications.filter(
      (certification) => certification.jobseeker_id === id
    );
    return certificates;
  };

  useEffect(() => {
    Promise.all([getUsers, getProjects, getCertifications]).then((response) => {
      console.log("response", response);
      setState((prev) => ({
        ...prev,
        user: userDetails(response[0].data, Number(url_id.id)),
        projects: getProjectsByUser(response[1].data, Number(url_id.id)),
        certifications: getCertificationsByUser(
          response[2].data,
          Number(url_id.id)
        ),
      }));
    });
  }, []);

  const mappedProjects = state.projects.map((project) => {
    return (
      <div className="projects-block">
        <ProjectListItem
          key={project.id}
          project_id={project.id}
          title={project.title}
          screenshot={project.screenshot}
          likes={project.likes}
        />
      </div>
    );
  });

  const mappedCertification = state.certifications.map((certification) => {
    return (
      <div className="certification-block">
        <Certification
          key={certification.id}
          title={certification.title}
          institution={certification.institution}
          city={certification.city}
          province={certification.province}
          startDate={certification.start_date}
          endDate={certification.end_date}
        />
      </div>
    );
  });

  return (
    <div className="developer-detail">
      <Button variant="outlined" href="/projects/new">
        Add New Project&nbsp;
        <GoPlus />
      </Button>
      <div className="developer-detail-container">
        <div className="profile-section">
          <Profile user={state.user} />
        </div>
        <PerfectScrollbar
          onScrollY={(container) =>
            console.log(`scrolled to: ${container.scrollTop}.`)
          }
        >
          <div className="section-right">
            <div className="project-section">{mappedProjects}</div>
            <span className="certification-container">
              <h4 className="certification-title">Certifications</h4>
              <Button
                variant="outlined"
                href={`${url_id.id}/certifications/new`}
              >
                Add New&nbsp;
                <GoPlus />
              </Button>
            </span>
            <div className="certification-section">{mappedCertification}</div>
          </div>
        </PerfectScrollbar>
      </div>
    </div>
  );
};

export default DeveloperDetail;
