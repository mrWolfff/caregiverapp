package br.com.caregiverapp.domain.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "care_request_applications",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"care_request_id", "caregiver_profile_id"}
                )
        }
)
public class CareRequestApplication {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "care_request_id", nullable = false)
    private CareRequest careRequest;

    @ManyToOne(optional = false)
    @JoinColumn(name = "caregiver_profile_id", nullable = false)
    private CaregiverProfile caregiverProfile;

    @Column(columnDefinition = "text")
    private String message;

    @CreationTimestamp
    private OffsetDateTime createdAt;

    protected CareRequestApplication() {}

    public CareRequestApplication(
            CareRequest careRequest,
            CaregiverProfile caregiverProfile,
            String message
    ) {
        this.careRequest = careRequest;
        this.caregiverProfile = caregiverProfile;
        this.message = message;
    }

    // getters
    public UUID getId() { return id; }
    public CareRequest getCareRequest() { return careRequest; }
    public CaregiverProfile getCaregiverProfile() { return caregiverProfile; }
    public String getMessage() { return message; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
