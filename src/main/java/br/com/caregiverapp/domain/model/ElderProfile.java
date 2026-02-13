package br.com.caregiverapp.domain.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "elder_profiles")
public class ElderProfile {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "text")
    private String bio;

    @Column(name = "care_needs", columnDefinition = "text")
    private String careNeeds;

    @Column(name = "medical_conditions", columnDefinition = "text")
    private String medicalConditions;

    @Column(name = "mobility_level")
    private String mobilityLevel;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false, length = 2)
    private String state;

    @CreationTimestamp
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;

    @Column(nullable = false, length = 15)
    private String phone;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    @Column(name = "emergency_phone")
    private String emergencyPhone;

    @Column(nullable = false)
    private String address;

    protected ElderProfile() {}

    public ElderProfile(
            User user,
            String bio,
            String careNeeds,
            String medicalConditions,
            String mobilityLevel,
            String city,
            String state
    ) {
        this.user = user;
        this.bio = bio;
        this.careNeeds = careNeeds;
        this.medicalConditions = medicalConditions;
        this.mobilityLevel = mobilityLevel;
        this.city = city;
        this.state = state;
    }

    // getters
    public UUID getId() { return id; }
    public User getUser() { return user; }
    public String getBio() { return bio; }
    public String getCareNeeds() { return careNeeds; }
    public String getMedicalConditions() { return medicalConditions; }
    public String getMobilityLevel() { return mobilityLevel; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getPhone() { return phone; }
    public String getEmergencyContact() { return emergencyContact; }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public void setEmergencyPhone(String emergencyPhone) {
        this.emergencyPhone = emergencyPhone;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setState(String state) {
        this.state = state;
    }
}
