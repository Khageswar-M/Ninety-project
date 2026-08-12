package Ninety.com.backend.entity;

import Ninety.com.backend.utils.GridConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "challenge")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Challenge{
    private static final int TOTAL_DAYS = 90;
    private static final int ROWS = 9;
    private static final int COLS = 10;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String title;

    @Builder.Default
    @Lob
    @Convert(converter = GridConverter.class)
    @Column(name = "day_grid", columnDefinition = "LONGTEXT", nullable = false)
    private boolean[][] dayGrid = new boolean[ROWS][COLS];

    @Column(nullable = false)
    @Builder.Default
    private int currentDay = 1;

    @Column(nullable = false)
    @Builder.Default
    private int currentStreak = 0;

    @Column(nullable = false)
    @Builder.Default
    private int longestStreak = 0;

    @Column(nullable = false)
    @Builder.Default
    private int streakCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private int completedCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private int missedCount = 0;

    @Column(nullable = false)
    private LocalDate startedAt;

    @Column(nullable = false)
    @Builder.Default
    private boolean completed = false;

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Activity> activities = new ArrayList<>();

    @Column(nullable = false, updatable = false) 
    @CreationTimestamp
    private LocalDate createdAt;

    @UpdateTimestamp
    private LocalDate updatedAt;
}
