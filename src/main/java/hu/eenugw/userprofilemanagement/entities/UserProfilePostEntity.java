package hu.eenugw.userprofilemanagement.entities;

import java.time.Instant;
import java.util.List;

import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.VarcharJdbcType;

import hu.eenugw.core.helpers.InstantConverter;
import jakarta.annotation.Nullable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
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
@Entity(name = "userProfilePost")
@Table(name = "user_profile_posts")
public class UserProfilePostEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcType(VarcharJdbcType.class)
    private String id;

    @Version
    private int version;

    @Lob
    public String description;

    public String photoPath;

    @Convert(converter = InstantConverter.class)
    public Instant creationDateUtc;

    @Nullable
    @ManyToOne(
        targetEntity = UserProfileEntity.class,
        fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id")
    private UserProfileEntity userProfile;

    @Nullable
    @OneToMany(
        targetEntity = UserProfilePostCommentEntity.class,
        mappedBy = "userProfilePost",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL)
    private List<UserProfilePostCommentEntity> userProfilePostComments;

    @Nullable
    @ManyToMany(
        targetEntity = UserProfileEntity.class,
        fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_profile_post_likes",
        joinColumns = @JoinColumn(name = "user_profile_post_id"),
        inverseJoinColumns = @JoinColumn(name = "user_profile_id"))
    private List<UserProfileEntity> userProfileLikes;

    @Nullable
    @ManyToMany(
        targetEntity = UserProfileEntity.class,
        fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_profile_post_hearts",
        joinColumns = @JoinColumn(name = "user_profile_post_id"),
        inverseJoinColumns = @JoinColumn(name = "user_profile_id"))
    private List<UserProfileEntity> userProfileHearts;
}
