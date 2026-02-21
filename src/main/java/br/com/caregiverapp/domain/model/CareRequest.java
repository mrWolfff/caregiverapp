package br.com.caregiverapp.domain.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "care_requests")
public class CareRequest {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "elder_profile_id", nullable = false)
    private ElderProfile elderProfile;

    @Column(columnDefinition = "text", nullable = false)
    private String description;

    @Column(name = "care_date", nullable = false)
    private LocalDate careDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false, length = 2)
    private String state;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CareRequestStatus status;

    @CreationTimestamp
    private OffsetDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "assigned_caregiver_profile_id")
    private CaregiverProfile assignedCaregiver;

    public void assignCaregiver(CaregiverProfile caregiverProfile) {
        this.assignedCaregiver = caregiverProfile;
        this.status = CareRequestStatus.ASSIGNED;
    }


    protected CareRequest() {}

    public CareRequest(
            ElderProfile elderProfile,
            String description,
            LocalDate careDate,
            LocalTime startTime,
            LocalTime endTime,
            String city,
            String state
    ) {
        this.elderProfile = elderProfile;
        this.description = description;
        this.careDate = careDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.city = city;
        this.state = state;
        this.status = CareRequestStatus.OPEN;
    }

    // getters

    public UUID getId() {
        return id;
    }

    public ElderProfile getElderProfile() {
        return elderProfile;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getCareDate() {
        return careDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public CareRequestStatus getStatus() {
        return status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public CaregiverProfile getAssignedCaregiver() {
        return assignedCaregiver;
    }
}
