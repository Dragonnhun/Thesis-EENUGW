package hu.eenugw.privatemessaging.entities;

import java.util.List;

import hu.eenugw.userprofilemanagement.entities.UserProfileEntity;
import jakarta.annotation.Nullable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity(name = "privateConversation")
@Table(name = "private_conversations")
public class PrivateConversationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Version
    private int version;

    @Nullable
    @ManyToMany(
        targetEntity = UserProfileEntity.class,
        fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_profile_private_conversations",
        joinColumns = @JoinColumn(name = "private_conversation_id"),
        inverseJoinColumns = @JoinColumn(name = "user_profile_id"))
    private List<UserProfileEntity> memberUserProfiles;

    @Nullable
    @OneToMany(
        targetEntity = PrivateMessageEntity.class,
        mappedBy = "privateConversation",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY)
    private List<PrivateMessageEntity> privateMessages;
}
