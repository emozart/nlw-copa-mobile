import { useEffect, useState, useCallback } from "react";
import { VStack, Icon, useToast, FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { PoolCard, PoolCardPros } from "../components/PoolCard";
import { useFocusEffect } from "@react-navigation/native";

import { api } from "../services/api";

export function Pools() {
  const [pools, setPools] = useState<PoolCardPros[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigate } = useNavigation();

  const toast = useToast();

  async function fertchPools() {
    try {
      setLoading(true);
      const response = await api.get("/pools");
      setPools(response.data.pools);
    } catch (erro) {
      console.log(erro);
      toast.show({
        title: "Não foi possível carregar os bolões",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fertchPools();
    }, [])
  );

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus Bolões" />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigate("find")}
        />
      </VStack>
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate("details", { id: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <EmptyPoolList />}
          _contentContainerStyle={{ paddingBottom: 10 }}
          px={5}
        />
      )}
    </VStack>
  );
}
