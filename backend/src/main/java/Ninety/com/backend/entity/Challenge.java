package Ninety.com.backend.entity;

import Ninety.com.backend.util.GridConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "challenges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Challenge {

    public static final int TOTAL_DAYS = 90;
    public static final int ROWS = 9;
    public static final int COLS = 10;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String title;

    @Lob
    @Convert(converter = GridConverter.class)
    @Column(name = "day_grid", columnDefinition = "LONGTEXT", nullable = false)
    private boolean[][] dayGrid;

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<DayLog> dayLogs = new ArrayList<>();

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
    private LocalDate startDate;

    @Column(nullable = false)
    @Builder.Default
    private boolean completed = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate(){
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.dayGrid == null) {
            this.dayGrid = new boolean[ROWS][COLS];
        }
        if (this.startDate == null) {
            this.startDate = LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
