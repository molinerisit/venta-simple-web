package com.ventasimple.panel.repository;

import com.ventasimple.panel.model.FeatureFlag;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface FeatureFlagRepository extends JpaRepository<FeatureFlag, UUID> {
    List<FeatureFlag> findByInstalacionId(UUID instalacionId);
    Optional<FeatureFlag> findByInstalacionIdAndNombre(UUID instalacionId, String nombre);
    void deleteByInstalacionId(UUID instalacionId);
}
