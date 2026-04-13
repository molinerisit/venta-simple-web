package com.ventasimple.panel.repository;

import com.ventasimple.panel.model.HeartbeatLog;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.*;

@Repository
public interface HeartbeatLogRepository extends JpaRepository<HeartbeatLog, Long> {
    List<HeartbeatLog> findTop50ByInstalacionIdOrderByTimestampDesc(UUID id);
    long countByInstalacionIdAndTimestampAfter(UUID id, Instant since);
}
